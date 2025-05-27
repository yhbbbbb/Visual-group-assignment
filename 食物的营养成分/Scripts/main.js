import DataLoading from "./DataLoading";
import Bar_Chart from "./Bar_Chart";
import Selector_Chart from "./Selector_Chart";
import Radar_Chart from "./Radar_Chart";

    let axes = [
        { id: "56",    name: "Ca",               full_name: "Calcium (Ca)",                                                unit: "Milligram/100 gram", rdi: 1200 }, // https://ods.od.nih.gov/factsheets/Calcium-Consumer/
        { id: "18",    name: "Cu",               full_name: "Copper (Cu)",                                                 unit: "Milligram/100 gram", rdi: 900 }, // https://ods.od.nih.gov/factsheets/Copper-Consumer/
        { id: "167",   name: "Mg",               full_name: "Magnesium (Mg)",                                              unit: "Milligram/100 gram", rdi: 375 }, // https://ods.od.nih.gov/factsheets/Magnesium-Consumer/
        { id: "73",    name: "P",                full_name: "Phosphorus (P)",                                              unit: "Milligram/100 gram", rdi: 1000 }, // https://ods.od.nih.gov/factsheets/Phosphorus-Consumer/
        { id: "161",   name: "K",                full_name: "Potassium (K)",                                               unit: "Milligram/100 gram", rdi: 3000 }, // https://ods.od.nih.gov/factsheets/Potassium-Consumer/
        { id: "34",    name: "Zn",               full_name: "Zinc (Zn)",                                                   unit: "Milligram/100 gram", rdi: 10 }, // https://ods.od.nih.gov/factsheets/Zinc-Consumer/
        { id: "43",    name: "Fe",                full_name: "Total iron",                                                  unit: "Milligram/100 gram", rdi: 15 }, // https://ods.od.nih.gov/factsheets/Iron-Consumer/
        { id: "529",   name: "Se",               full_name: "Total Selenium",                                              unit: "Milligram/100 gram", rdi: 55 }, // https://ods.od.nih.gov/factsheets/Selenium-Consumer/
        { id: "14176", name: "V-B1",               full_name: "Thiamin",                                                     unit: "Milligram/100 gram", rdi: 1.2 }, // https://ods.od.nih.gov/factsheets/Thiamin-Consumer/
        { id: "14150", name: "V-B2",               full_name: "Riboflavin",                                                  unit: "Milligram/100 gram", rdi: 1.2 }, // https://ods.od.nih.gov/factsheets/Riboflavin-Consumer/
        { id: "14112", name: "V-B3",               full_name: "Niacin equivalents, total",                                   unit: "Milligram/100 gram", rdi: 15 }, // https://ods.od.nih.gov/factsheets/Niacin-Consumer/
        { id: "14190", name: "V-B6",               full_name: "Vitamin B-6, total",                                          unit: "Milligram/100 gram", rdi: 1.3 }, // https://ods.od.nih.gov/factsheets/VitaminB6-Consumer/
        { id: "14189", name: "V-B12",              full_name: "Vitamin B-12",                                                unit: "Milligram/100 gram", rdi: 2.4 }, // https://ods.od.nih.gov/factsheets/VitaminB12-Consumer/
        { id: "14193", name: "V-E",                full_name: "Vitamin E; alpha-tocopherol equiv from E vitamer activities", unit: "Milligram/100 gram", rdi: 15 }, // https://ods.od.nih.gov/factsheets/VitaminE-Consumer/
        { id: "13727", name: "α-tocopherol",          full_name: "Alpha-tocopherol",                                            unit: "Milligram/100 gram", rdi: 15 }, // https://ods.od.nih.gov/factsheets/VitaminE-Consumer/
        { id: "14194", name: "K",                full_name: "Vitamin K, total",                                            unit: "Milligram/100 gram", rdi: 105 }, // https://ods.od.nih.gov/factsheets/vitaminK-Consumer/
    ];

    let barChart
    let selectorChart

    //数据读取
    let data_loading = new DataLoading()
    data_loading.promise.then(result => {
        barChart = new Bar_Chart(d3.select("svg.bars"),null, null, null, null, null, data_loading) // 初始化柱状图
        selectorChart = new Selector_Chart(d3.select("svg.bubbles"), data_loading)   // 初始化选择器
    })

    //雷达图初始化
    let radar = new Radar_Chart(d3.select("svg.radar"), axes);

    let selected_item_name
    let country = null;
    let category1 = null;
    let category2 = null;
    let category3 = null;

    //按层级深入
    radar.on("navigate-in", (_, datum) => {
        if (category1 == null) {
            category1 = datum.category1;
        } else if (category2 == null) {
            category2 = datum.category2;
        } else if (category3 == null) {
            category3 = datum.category3;
        }

        update_selection();
    });

    //反向退出层级
    radar.on("navigate-out", () => {
        if (category1 == null)
            return;
        if (category2 == null) {
            category1 = null;
        } else if (category3 == null) {
            category2 = null;
        } else {
            category3 = null;
        }

        update_selection();
    });

    addEventListener("resize", () => radar.draw(500));

    let data = await load_data();
    radar.selection = select_data();
    update_controls();

    //数据结构加载
    async function load_data() {
        let data = new Map();
        await d3.csv("dataset.csv", function (d) {
            if (!data.has(d.code)) {
                data.set(d.code, {
                    name: d.efsaprodcode2_recoded,
                    category1: d.level1,
                    category2: d.level2,
                    category3: d.level3,
                    nutrients: new Map(),
                });
            }
            data.get(d.code).nutrients.set({ n: d.NUTRIENT_ID, c: d.COUNTRY }, parseFloat(d.LEVEL));
        });
        return [...data.values()];
    }

    function select_nutrients(nutrient_lists) {
        let counts = new Map(axes.map(a => [a.id, 0]));
        let totals = new Map(axes.map(a => [a.id, 0]));
        for (let nutrient_list of nutrient_lists) {
            for (let [{ n: nutrient_id, c: nutrient_country }, value] of nutrient_list) {
                if (country != null && country != nutrient_country) continue;
                counts.set(nutrient_id, counts.get(nutrient_id) + 1);
                totals.set(nutrient_id, totals.get(nutrient_id) + value);
            }
        }
        return new Map(axes.map(a => [a.id, counts.get(a.id) > 0 ? totals.get(a.id) / counts.get(a.id) : 0]));
    }

    //数据选择逻辑
    function select_data() {
        let selection = data.filter(d =>
            (category1 == null || d.category1 == category1) &&
            (category2 == null || d.category2 == category2) &&
            (category3 == null || d.category3 == category3)
        );

        if (category1 == null) {
            return Array.from(d3.rollup(
                selection,
                values => ({
                    name: values[0].category1,
                    category1: values[0].category1,
                    nutrients: select_nutrients(values.map(v => v.nutrients)),
                    count: values.length,
                }),
                d => d.category1
            ).values());
        }
        if (category2 == null) {
            return Array.from(d3.rollup(
                selection,
                values => ({
                    name: values[0].category2,
                    category1: values[0].category1,
                    category2: values[0].category2,
                    nutrients: select_nutrients(values.map(v => v.nutrients)),
                    count: values.length,
                }),
                d => d.category2
            ).values());
        }
        if (category3 == null) {
            return Array.from(d3.rollup(
                selection,
                values => ({
                    name: values[0].category3,
                    category1: values[0].category1,
                    category2: values[0].category2,
                    category3: values[0].category3,
                    nutrients: select_nutrients(values.map(v => v.nutrients)),
                    count: values.length,
                }),
                d => d.category3
            ).values());
        }
        console.log(selection.map(v => ({
            ...v,
            nutrients: select_nutrients([v.nutrients]),
            count: 1,
        })))
        return selection.map(v => ({
            ...v,
            nutrients: select_nutrients([v.nutrients]),
            count: 1,
        }));
    }

    //筛选器联动
    function update_selection() {
        radar.selection = select_data();
        update_controls();
    }

    function update_controls() {

        let controls = d3.select("body > .layout > .controls");

        //控制面板实现
        let country_options = ["所有国家"].concat([...new Set(
                data.filter(d =>
                    (category1 == null || d.category1 == category1) &&
                    (category2 == null || d.category2 == category2) &&
                    (category3 == null || d.category3 == category3)
                ).flatMap(d =>
                    [...d.nutrients.keys()].map(k => k.c)
                )
            )].sort());

        let category1_options = ["All categories"].concat([...new Set(
                data.filter(d =>
                    country == null || ([...d.nutrients.keys()].filter(k => k.c == country).length > 0)
                ).map(d => d.category1)
            )].sort());

        let category2_options = ["All categories"].concat([...new Set(
                data.filter(d =>
                    (country == null || ([...d.nutrients.keys()].filter(k => k.c == country).length > 0)) &&
                    d.category1 == category1
                ).map(d => d.category2)
            )].sort());

        let category3_options = ["All categories"].concat([...new Set(
                data.filter(d =>
                    (country == null || ([...d.nutrients.keys()].filter(k => k.c == country).length > 0)) &&
                    d.category1 == category1 &&
                    d.category2 == category2
                ).map(d => d.category3)
            )].sort());

        let country_control = controls.select(".country");
        let category1_control = controls.select(".category1");
        let category2_control = controls.select(".category2");
        let category3_control = controls.select(".category3");



        country_control.selectAll("option")
            .data(country_options)
            .join("option")
            .text(d => d);

        //当上级分类变更时，自动清空下级选择
        country_control
            .property("value", country ?? "所有国家")
            .on("input", () => {
                country = country_control.property("value");
                if (country == "所有国家") country = null;
                update_selection();
                console.log(country)
                console.log(selected_item_name)
                Send_Selected(category1,category2,category3, selected_item_name)
            });

        category1_control.selectAll("option")
            .data(category1_options)
            .join("option")
            .text(d => d);

        category1_control
            .property("value", category1 ?? "All categories")
            .on("input", () => {
                category1 = category1_control.property("value");
                if (category1 == "All categories")
                category1 = null;
                category2 = null;
                category3 = null;
                update_selection();
                selectorChart.zoomByCat(category1,category2,category3)
                Send_Selected(category1, category2, category3, null, null)
            });

        category2_control.selectAll("option")
            .data(category2_options)
            .join("option")
            .text(d => d);

        category2_control
            .property("value", category2 ?? "All categories")
            .on("input", () => {
                category2 = category2_control.property("value");
                if (category2 == "All categories") category2 = null;
                category3 = null;
                update_selection();
                selectorChart.zoomByCat(category1,category2,category3)
                Send_Selected(category1, category2, category3, null, null)
            });

        category3_control.selectAll("option")
            .data(category3_options)
            .join("option")
            .text(d => d);

        category3_control
            .property("value", category3 ?? "All categories")
            .on("input", () => {
                category3 = category3_control.property("value");
                if (category3 == "All categories") category3 = null;
                update_selection();
                selectorChart.zoomByCat(category1,category2,category3)
                Send_Selected(category1, category2, category3, null, null)
            });

        let buttons = controls.select(".buttons");

        function update_layout(layout) {
            d3.select("body > .layout").attr("class", `layout ${layout}`);
            radar.draw(500);
        }

        buttons.select(".layout1").on("click", () => update_layout("layout1"));
        buttons.select(".layout2").on("click", () => update_layout("layout2"));

    }

    export default function Send_Selected(cat1, cat2, cat3, item_name, text){

        category1 = cat1
        category2 = cat2
        category3 = cat3
        selected_item_name = item_name
        if(item_name == "root"){
            category1 = null
            category2 = null
            category3 = null
            country = country
        }
        update_selection()

        d3.selectAll("svg.bars > *").remove();
        // document.getElementById("selection_data_text").innerHTML = text;
        barChart =  new Bar_Chart(d3.select("svg.bars"), category1, category2, category3, country, selected_item_name, data_loading)

    }