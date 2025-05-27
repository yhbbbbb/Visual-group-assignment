export default class DataLoading {
    constructor() {
        this.dataSet = null
        this.promise = d3.csv("dataset.csv").then(d => this.dataSet = d)
    }

    async Data_Hierarchy(){
        let data = new Map();   //用于存储处理后的食品数据
        // 遍历原始数据集，d代表单条食品数据记录
        this.dataSet.map( function (d) {
            if (!data.has(d.code)) {
                //如果 data 中不存在当前食品编码 (d.code)，则初始化该食品的元数据，元数据可以看数据集
                data.set(d.code, {
                    name: d.efsaprodcode2_recoded,
                    category1: d.level1,
                    category2: d.level2,
                    category3: d.level3,
                    nutrients: new Map(),
                    id: d.FOOD_ID,
                });
            }
            //如果当前食品的 nutrients 中没有该国家 (d.COUNTRY) 的数据，则初始化一个嵌套 Map
            if(!data.get(d.code).nutrients.has(d.COUNTRY)){
                data.get(d.code).nutrients.set(d.COUNTRY, new Map())
            }
            /*
            下面语句的数据结构，记录当前食品在特定国家下的每种营养素含量
            {
                [国家]: Map({
                    { n_id: "营养素ID", n_name: "营养素名称" }: 含量数值
                })
            }
            */
            data.get(d.code).nutrients.get(d.COUNTRY).set({ n_id: d.NUTRIENT_ID, n_name: d.NUTRIENT_TEXT}, parseFloat(d.LEVEL));
        });
        let hierarchy_data = {"name":"root", color:"white", children:[]}

        let food_code_iterator = data.keys()    //获取所有食品编码的迭代器
        //遍历每个食品，通过 food 变量获取当前食品的完整数据
        for (let i = 0; i < data.size; i++){
            let food = data.get(food_code_iterator.next().value)

            //处理一级分类，检查根节点下是否已存在当前一级分类，不存在则创建，同时初始化children准备存放二级分类
            if (this.node_contains_category(hierarchy_data, food.category1) == false){
                let category1_data = {"name":food.category1, color:"white", children:[]}
                //处理二级分类，仅处理与当前一级分类相同的食品
                let food_code_iterator_2 = data.keys()
                for (let i = 0; i < data.size; i++){
                    let food_2 = data.get(food_code_iterator_2.next().value)
                    if (food_2.category1 == food.category1 && this.node_contains_category(category1_data, food_2.category2) == false){
                        let category2_data = {"name":food_2.category2, color:"white", children:[]}
                        //处理三级分类，仅处理与前两级分类相同的食品
                        let food_code_iterator_3 = data.keys()
                        for (let i = 0; i < data.size; i++){
                            let food_3 = data.get(food_code_iterator_3.next().value)
                            if (food_3.category1 == food.category1 && food_3.category2 == food_2.category2 && this.node_contains_category(category2_data, food_3.category3) == false){
                                let category3_data = {"name":food_3.category3, color:"white", children:[]}
                                //嵌套遍历处理具体食品，精确匹配当前一、二、三级分类，将食品作为叶子节点添加到三级分类下
                                let food_code_iterator_4 = data.keys()
                                for (let i = 0; i < data.size; i++){
                                    let food_4 = data.get(food_code_iterator_4.next().value)
                                    if (food_4.category1 == food.category1 && food_4.category2 == food_2.category2 && food_4.category3 == food_3.category3 && this.node_contains_category(category2_data, food_3.category3) == false){
                                        let food_data = {"name":food_4.name, color:"white", value: 25}
                                        category3_data.children.push(food_data)
                                    }
                                }
                                category2_data.children.push(category3_data)//逐级挂载节点，1，2，3
                            }
                        }
                        category1_data.children.push(category2_data)
                    }
                }
                hierarchy_data.children.push(category1_data)
            }
        }
        return hierarchy_data
    }

    /*
    使用可选链操作符 (?.) 避免属性不存在时的报错
    使用 Array.some 简化代码
    不区分大小写比较
    默认返回 false
     */
    node_contains_category(node, category_name) {
    return node.children?.some(child =>
        child.name?.toLowerCase() === category_name?.toLowerCase()
    ) ?? false;
}
    async import_barchart_data(cat1, cat2, cat3, cou){

        let axes = [
            { id: "56",    name: "Ca",               full_name: "Calcium (Ca)",                                                unit: "Milligram/100 gram", rdi: 1200 }, // https://ods.od.nih.gov/factsheets/Calcium-Consumer/
            { id: "43",    name: "F",                full_name: "Total iron",                                                  unit: "Milligram/100 gram", rdi: 15 }, // https://ods.od.nih.gov/factsheets/Iron-Consumer/
            { id: "167",   name: "Mg",               full_name: "Magnesium (Mg)",                                              unit: "Milligram/100 gram", rdi: 375 }, // https://ods.od.nih.gov/factsheets/Magnesium-Consumer/
            { id: "14112", name: "B3",               full_name: "Niacin equivalents, total",                                   unit: "Milligram/100 gram", rdi: 15 }, // https://ods.od.nih.gov/factsheets/Niacin-Consumer/
            { id: "73",    name: "P",                full_name: "Phosphorus (P)",                                              unit: "Milligram/100 gram", rdi: 1000 }, // https://ods.od.nih.gov/factsheets/Phosphorus-Consumer/
            { id: "161",   name: "K",                full_name: "Potassium (K)",                                               unit: "Milligram/100 gram", rdi: 3000 }, // https://ods.od.nih.gov/factsheets/Potassium-Consumer/
            { id: "14150", name: "B2",               full_name: "Riboflavin",                                                  unit: "Milligram/100 gram", rdi: 1.2 }, // https://ods.od.nih.gov/factsheets/Riboflavin-Consumer/
            { id: "529",   name: "Se",               full_name: "Total Selenium",                                              unit: "Microgram/100 gram", rdi: 55 }, // https://ods.od.nih.gov/factsheets/Selenium-Consumer/
            { id: "14176", name: "B1",               full_name: "Thiamin",                                                     unit: "Milligram/100 gram", rdi: 1.2 }, // https://ods.od.nih.gov/factsheets/Thiamin-Consumer/
            { id: "14190", name: "B6",               full_name: "Vitamin B-6, total",                                          unit: "Milligram/100 gram", rdi: 1.3 }, // https://ods.od.nih.gov/factsheets/VitaminB6-Consumer/
            { id: "14189", name: "B12",              full_name: "Vitamin B-12",                                                unit: "Microgram/100 gram", rdi: 2.4 }, // https://ods.od.nih.gov/factsheets/VitaminB12-Consumer/
            { id: "14193", name: "E",                full_name: "Vitamin E; alpha-tocopherol equiv from E vitamer activities", unit: "Milligram/100 gram", rdi: 15 }, // https://ods.od.nih.gov/factsheets/VitaminE-Consumer/
            { id: "13727", name: "Alpha-tocopherol", full_name: "Alpha-tocopherol",                                            unit: "Milligram/100 gram", rdi: 15 }, // https://ods.od.nih.gov/factsheets/VitaminE-Consumer/
            { id: "14194", name: "KV",                full_name: "Vitamin K, total",                                           unit: "Microgram/100 gram", rdi: 105 }, // https://ods.od.nih.gov/factsheets/vitaminK-Consumer/
            { id: "34",    name: "Zn",               full_name: "Zinc (Zn)",                                                    unit: "Milligram/100 gram", rdi: 10 }, // https://ods.od.nih.gov/factsheets/Zinc-Consumer/
            { id: "18",    name: "Cu",               full_name: "Copper (Cu)",                                                 unit: "Milligram/100 gram", rdi: 900 } // https://ods.od.nih.gov/factsheets/Copper-Consumer/
        ];

        let data = new Map()
        this.dataSet.map( function (d) {
             // 条件过滤：分类层级 + 国家
            if ((d.level1 == cat1 || cat1 == null) && (d.level2 == cat2 || cat2 == null) && (d.level3 == cat3  || cat3 == null) && (d.COUNTRY == cou  || cou == null)){
                  // 初始化营养素统计容器
                if(!data.has(d.NUTRIENT_TEXT)){
                    data.set(d.NUTRIENT_TEXT, new Map());
                    // 预定义所有国家的统计结构 [总和, 计数]
                    data.get(d.NUTRIENT_TEXT).set("Finland", [0,0]);
                    data.get(d.NUTRIENT_TEXT).set("France", [0,0]);
                    data.get(d.NUTRIENT_TEXT).set("Germany", [0,0]);
                    data.get(d.NUTRIENT_TEXT).set("Italy", [0,0]);
                    data.get(d.NUTRIENT_TEXT).set("Netherlands", [0,0]);
                    data.get(d.NUTRIENT_TEXT).set("Sweden", [0,0]);
                    data.get(d.NUTRIENT_TEXT).set("United Kingdom", [0,0]);
                }
                let values = data.get(d.NUTRIENT_TEXT).get(d.COUNTRY)
                if(d.UNIT == "Microgram/100 gram"){
                    //单位转换
                    data.get(d.NUTRIENT_TEXT).set(d.COUNTRY, [parseFloat(values[0]) + parseFloat(d.LEVEL/1000), parseFloat(values[1]) + 1])
                }else{
                    //累加
                    data.get(d.NUTRIENT_TEXT).set(d.COUNTRY, [parseFloat(values[0]) + parseFloat(d.LEVEL), parseFloat(values[1]) + 1])
                }
            }
        });

        let bar_chart_data = []
        let nutrient_iterator = data.keys()
        let nutrients_toShow = []

        for (const [key, value] of data) {
            axes.forEach(a => {
                if(a.full_name.toUpperCase() == key.toUpperCase()){
                    nutrients_toShow.push(a)
                }
            })
        }
        for (let i = 0; i < data.size; i++){

            let nutrient = data.get(nutrient_iterator.next().value)
            let nutrient_data = {name: nutrients_toShow[i].name, Finland: 0, France: 0, Germany: 0, Italy: 0, Netherlands: 0, Sweden:0 , UK: 0}
            let country_iterator = nutrient.keys()
            for(let j = 0; j < nutrient.size; j++){
                let country = nutrient.get(country_iterator.next().value)
                //console.log(country)
                if(j==0){

                    nutrient_data.Finland = country[0]/country[1] ? country[0]/country[1] : 0
                }
                if(j==1){

                    nutrient_data.France = country[0]/country[1] ? country[0]/country[1] : 0
                }
                if(j==2){
                    nutrient_data.Germany = country[0]/country[1] ? country[0]/country[1] : 0
                }
                if(j==3){
                    nutrient_data.Italy = country[0]/country[1] ? country[0]/country[1] : 0
                }
                if(j==4){
                    nutrient_data.Netherlands = country[0]/country[1] ? country[0]/country[1] : 0
                }
                if(j==5){
                    nutrient_data.Sweden = country[0]/country[1] ? country[0]/country[1] : 0
                }
                if(j==6){
                    nutrient_data.UK = country[0]/country[1] ? country[0]/country[1] : 0
                }
            }
           // console.log(nutrient_data)
            bar_chart_data.push(nutrient_data)
        }
        return bar_chart_data
    }

    async import_barchart_data_single_item(item, country, ctg1, ctg2,ctg3){
        let axes = [
            { id: "56",    name: "Ca",               full_name: "Calcium (Ca)",                                                unit: "Milligram/100 gram", rdi: 1200 }, // https://ods.od.nih.gov/factsheets/Calcium-Consumer/
            { id: "43",    name: "F",                full_name: "Total iron",                                                  unit: "Milligram/100 gram", rdi: 15 }, // https://ods.od.nih.gov/factsheets/Iron-Consumer/
            { id: "167",   name: "Mg",               full_name: "Magnesium (Mg)",                                              unit: "Milligram/100 gram", rdi: 375 }, // https://ods.od.nih.gov/factsheets/Magnesium-Consumer/
            { id: "14112", name: "B3",               full_name: "Niacin equivalents, total",                                   unit: "Milligram/100 gram", rdi: 15 }, // https://ods.od.nih.gov/factsheets/Niacin-Consumer/
            { id: "73",    name: "P",                full_name: "Phosphorus (P)",                                              unit: "Milligram/100 gram", rdi: 1000 }, // https://ods.od.nih.gov/factsheets/Phosphorus-Consumer/
            { id: "161",   name: "K",                full_name: "Potassium (K)",                                               unit: "Milligram/100 gram", rdi: 3000 }, // https://ods.od.nih.gov/factsheets/Potassium-Consumer/
            { id: "14150", name: "B2",               full_name: "Riboflavin",                                                  unit: "Milligram/100 gram", rdi: 1.2 }, // https://ods.od.nih.gov/factsheets/Riboflavin-Consumer/
            { id: "529",   name: "Se",               full_name: "Total Selenium",                                              unit: "Microgram/100 gram", rdi: 55 }, // https://ods.od.nih.gov/factsheets/Selenium-Consumer/
            { id: "14176", name: "B1",               full_name: "Thiamin",                                                     unit: "Milligram/100 gram", rdi: 1.2 }, // https://ods.od.nih.gov/factsheets/Thiamin-Consumer/
            { id: "14190", name: "B6",               full_name: "Vitamin B-6, total",                                          unit: "Milligram/100 gram", rdi: 1.3 }, // https://ods.od.nih.gov/factsheets/VitaminB6-Consumer/
            { id: "14189", name: "B12",              full_name: "Vitamin B-12",                                                unit: "Microgram/100 gram", rdi: 2.4 }, // https://ods.od.nih.gov/factsheets/VitaminB12-Consumer/
            { id: "14193", name: "E",                full_name: "Vitamin E; alpha-tocopherol equiv from E vitamer activities", unit: "Milligram/100 gram", rdi: 15 }, // https://ods.od.nih.gov/factsheets/VitaminE-Consumer/
            { id: "13727", name: "Alpha-tocopherol", full_name: "Alpha-tocopherol",                                            unit: "Milligram/100 gram", rdi: 15 }, // https://ods.od.nih.gov/factsheets/VitaminE-Consumer/
            { id: "14194", name: "KV",                full_name: "Vitamin K, total",                                            unit: "Microgram/100 gram", rdi: 105 }, // https://ods.od.nih.gov/factsheets/vitaminK-Consumer/
            { id: "34",    name: "Zn",               full_name: "Zinc (Zn)",                                                   unit: "Milligram/100 gram", rdi: 10 }, // https://ods.od.nih.gov/factsheets/Zinc-Consumer/
            { id: "18",    name: "Cu",               full_name: "Copper (Cu)",                                                 unit: "Milligram/100 gram", rdi: 900 } // https://ods.od.nih.gov/factsheets/Copper-Consumer/
        ];


        let data = new Map()
        this.dataSet.map(function (d) {

            if (d.efsaprodcode2_recoded == item && d.level1 == ctg1 && d.level2 == ctg2 && d.level3 == ctg3 ){
                console.log( "Ey lekker maan")

                if(!data.has(d.NUTRIENT_TEXT)){
                    data.set(d.NUTRIENT_TEXT, new Map());
                    data.get(d.NUTRIENT_TEXT).set("Finland", [0,0]);
                    data.get(d.NUTRIENT_TEXT).set("France", [0,0]);
                    data.get(d.NUTRIENT_TEXT).set("Germany", [0,0]);
                    data.get(d.NUTRIENT_TEXT).set("Italy", [0,0]);
                    data.get(d.NUTRIENT_TEXT).set("Netherlands", [0,0]);
                    data.get(d.NUTRIENT_TEXT).set("Sweden", [0,0]);
                    data.get(d.NUTRIENT_TEXT).set("United Kingdom", [0,0]);
                }
                let values = data.get(d.NUTRIENT_TEXT).get(d.COUNTRY)
                if(d.UNIT == "Microgram/100 gram"){
                    data.get(d.NUTRIENT_TEXT).set(d.COUNTRY, [parseFloat(values[0]) + parseFloat(d.LEVEL/1000), parseFloat(values[1]) + 1])
                }
                else{
                    data.get(d.NUTRIENT_TEXT).set(d.COUNTRY, [parseFloat(values[0]) + parseFloat(d.LEVEL), parseFloat(values[1]) + 1])
                }


            }

        });

        let nutrients_toShow = []
        for (const [key, value] of data) {
            axes.forEach(a => {
                if(a.full_name.toUpperCase() == key.toUpperCase()){
                    nutrients_toShow.push(a)
                }
            })
        }
        let bar_chart_data = []
        let nutrient_iterator = data.keys()
        for (let i = 0; i < data.size; i++){
            let nutrient = data.get(nutrient_iterator.next().value)
            let nutrient_data = {name: nutrients_toShow[i].name, Finland: 0, France: 0, Germany: 0, Italy: 0, Netherlands: 0, Sweden:0 , UK: 0}

            let country_iterator = nutrient.keys()
            for(let j = 0; j < nutrient.size; j++){
                let country = nutrient.get(country_iterator.next().value)

                if(j==0){
                    nutrient_data.Finland = country[0]/country[1] ? country[0]/country[1] : 0
                }
                if(j==1){
                    nutrient_data.France = country[0]/country[1] ? country[0]/country[1] : 0
                }
                if(j==2){
                    nutrient_data.Germany = country[0]/country[1] ? country[0]/country[1] : 0
                }
                if(j==3){
                    nutrient_data.Italy = country[0]/country[1] ? country[0]/country[1] : 0
                }
                if(j==4){
                    nutrient_data.Netherlands = country[0]/country[1] ? country[0]/country[1] : 0
                }
                if(j==5){
                    nutrient_data.Sweden = country[0]/country[1] ? country[0]/country[1] : 0
                }
                if(j==6){
                    nutrient_data.UK = country[0]/country[1] ? country[0]/country[1] : 0
                }
            }

            bar_chart_data.push(nutrient_data)

        }
        if(country){
            bar_chart_data.forEach(obj => {
                for(let key in obj){
                    if(key != "name" && key != country){

                            if(country != "United Kingdom" || key != "UK"){
                                obj[key] = null
                            }

                    }

                }
            })
        }
        return bar_chart_data
    }
}