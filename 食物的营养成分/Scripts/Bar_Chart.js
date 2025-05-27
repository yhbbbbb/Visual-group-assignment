import EventListener from "./EventListener.js";

export default class Bar_Chart extends EventListener {
cat1
cat2
cat3
cou
selected_item

     constructor(svg, cat1, cat2, cat3, cou, selected_item, dataReader) {
        super()
        this.cat1 = cat1;  // 一级分类
        this.cat2 = cat2;  // 二级分类
        this.cat3 = cat3;  // 三级分类
        this.cou = cou;    // 国家
        this.selected_item = selected_item; // 选中项
        this.data_reader = dataReader;     // 数据读取器
        this.init(svg);    // 初始化图表
    }

    async init (svg){
        //数据加载
        let data
        if( this.selected_item == null || this.selected_item == "root"){    //默认情况，获取分类下所有数据
            data = await this.data_reader.import_barchart_data(this.cat1, this.cat2, this.cat3, this.cou)
        }else{  //选中特定项时，取单项数据
            data = await this.data_reader.import_barchart_data_single_item(this.selected_item, this.cou, this.cat1, this.cat2, this.cat3)
        }
        // 图表基础设置
        let width = svg.node().getBoundingClientRect().width/1.1    //SVG容器宽度动态调整
        let height = 330    //预留左侧和顶部边距
        svg.append("g").attr("transform", `translate(50,30)`);

        // X轴比例尺（分组+子分组）
        var xScale0 = d3.scaleBand().range([0, width*0.98]).padding(0.8); // 营养素分组
        var xScale1 = d3.scaleBand() // 国家子分组
        // Y轴比例尺（每种营养素独立）
        var yScale = d3.scaleLinear().range([ 0,height - 60])
        var yScaleCu = d3.scaleLinear().range([ 0,height - 60])
        var yScaleMg = d3.scaleLinear().range([ 0,height - 60])
        var yScaleP = d3.scaleLinear().range([ 0,height - 60])
        var yScaleK = d3.scaleLinear().range([ 0,height - 60])
        var yScaleZn = d3.scaleLinear().range([ 0,height - 60])
        var yScaleF = d3.scaleLinear().range([ 0,height - 60])
        var yScaleSe = d3.scaleLinear().range([ 0,height - 60])
        var yScaleB1 = d3.scaleLinear().range([ 0,height - 60])
        var yScaleB2 = d3.scaleLinear().range([ 0,height - 60])
        var yScaleB3 = d3.scaleLinear().range([ 0,height - 60])
        var yScaleB6 = d3.scaleLinear().range([ 0,height - 60])
        var yScaleB12 = d3.scaleLinear().range([ 0, height-60])
        var yScaleE = d3.scaleLinear().range([ 0,height - 60])
        var yScaleAt = d3.scaleLinear().range([ 0,height - 60])
        var yScaleKV = d3.scaleLinear().range([ 0,height - 60])

        // Y轴比例尺（每种营养素独立）
        var xAxis = d3.axisBottom(xScale0).tickSizeOuter(0);

        //Y轴：左侧显示数值刻度（每个营养素独立）
        var yAxis = d3.axisLeft(yScale).ticks(5).tickSizeOuter(0);
        var yAxisCu = d3.axisLeft(yScaleCu).ticks(5).tickSizeOuter(0);
        var yAxisMg = d3.axisLeft(yScaleMg).ticks(5).tickSizeOuter(0);
        var yAxisP = d3.axisLeft(yScaleP).ticks(5).tickSizeOuter(0);
        var yAxisK = d3.axisLeft(yScaleK).ticks(5).tickSizeOuter(0);
        var yAxisZn = d3.axisLeft(yScaleZn).ticks(5).tickSizeOuter(0);
        var yAxisF = d3.axisLeft(yScaleF).ticks(5).tickSizeOuter(0);
        var yAxisSe = d3.axisLeft(yScaleSe).ticks(5).tickSizeOuter(0);
        var yAxisB1 = d3.axisLeft(yScaleB1).ticks(5).tickSizeOuter(0);
        var yAxisB2 = d3.axisLeft(yScaleB2).ticks(5).tickSizeOuter(0);
        var yAxisB3 = d3.axisLeft(yScaleB3).ticks(5).tickSizeOuter(0);
        var yAxisB6 = d3.axisLeft(yScaleB6).ticks(5).tickSizeOuter(0);
        var yAxisB12 = d3.axisLeft(yScaleB12).ticks(5).tickSizeOuter(0);
        var yAxisE = d3.axisLeft(yScaleE).ticks(5).tickSizeOuter(0);
        var yAxisAt = d3.axisLeft(yScaleAt).ticks(5).tickSizeOuter(0);
        var yAxisKV = d3.axisLeft(yScaleKV).ticks(5).tickSizeOuter(0);


        yAxis.id = "Ca"
        yAxisCu.id = "Cu"
        yAxisMg.id = "Mg"
        yAxisP.id = "P"
        yAxisK.id = "K"
        yAxisZn.id = "Zn"
        yAxisF.id = "F"
        yAxisSe.id = "Se"
        yAxisB1.id = "B1"
        yAxisB2.id = "B2"
        yAxisB3.id = "B3"
        yAxisB6.id = "B6"
        yAxisB12.id = "B12"
        yAxisE.id = "E"
        yAxisAt.id = "Alpha-tocopherol"
        yAxisKV.id = "KV"

        let axises = [yAxis, yAxisF, yAxisMg, yAxisB3, yAxisP, yAxisK, yAxisB2, yAxisSe, yAxisB1, yAxisB6, yAxisB12, yAxisE, yAxisAt, yAxisKV, yAxisZn, yAxisCu]

        yScale.id = "Ca"
        yScaleCu.id = "Cu"
        yScaleMg.id = "Mg"
        yScaleP.id = "P"
        yScaleK.id = "K"
        yScaleZn.id = "Zn"
        yScaleF.id = "F"
        yScaleSe.id = "Se"
        yScaleB1.id = "B1"
        yScaleB2.id = "B2"
        yScaleB3.id = "B3"
        yScaleB6.id = "B6"
        yScaleB12.id = "B12"
        yScaleE.id = "E"
        yScaleAt.id = "Alpha-tocopherol"
        yScaleKV.id = "KV"

        let scales = [yScale, yScaleF, yScaleMg, yScaleB3, yScaleP, yScaleK,
        yScaleB2, yScaleSe, yScaleB1, yScaleB6, yScaleB12, yScaleE, yScaleAt, yScaleKV, yScaleZn, yScaleCu]
        let max2 = 0
        let count = 0

        // 动态设置Y轴定义域
        let toShow = []
        data.forEach(obj => {
            max2 = 0
            for (let key in obj) {
                if(obj[key] > max2){
                    max2 = obj[key]
                }
            }

            if(max2 > 0){
                scales.forEach(s => {
                    if(s.id == obj.name){
                        //s =d3.scaleLinear().range([ 0,height - 60])
                        //s.id == obj.name
                        s.domain([max2,0])
                        toShow.push(s)
                    }
                })
            }

            count++

        })

        // 设置X轴定义域
        xScale0.domain(toShow.map(d => d.id)) // 显示有数据的营养素
        xScale1.domain(['Finland', 'France', 'Germany', 'Italy', 'Netherlands', 'Sweden', 'UK']).range([0, xScale0.bandwidth()])    // 固定7个国家

        var nutrient_name = svg.selectAll(".nutrient_name")
            .data(data)
            .enter().append("g")
            .attr("class", "nutrient_name")
            .attr("transform", d => `translate(${xScale0(d.name) + 40},10)`);

            // 为每个国家的数据添加柱子
            nutrient_name.selectAll(".bar.Finland")
            .data(d => [d])
            .enter()
            .append("rect")
            .attr("class", "bar Finland")
            .style("fill",d3.rgb(255, 0, 0))
            .attr("x", d => xScale1('Finland'))
            .attr("y", d => scales.filter(s => s.id == d.name)[0](d.Finland))
            .attr("width", xScale1.bandwidth())
            .attr("height", d => {
                return 0
            })
            .transition()
            .delay("200")
            .duration("700")
            .attr('height', d => toShow.filter(s => s.id == d.name)[0] ? height - 60 - toShow.filter(s => s.id == d.name)[0](d.Finland) : 0)

            nutrient_name.selectAll(".bar.France")
            .data(d => [d])
            .enter()
            .append("rect")
            .attr("class", "bar France")
            .style("fill",d3.rgb(255, 80, 0))
            .attr("x", d => xScale1('France'))
            .attr("y", d => scales.filter(s => s.id == d.name)[0](d.France))
            .attr("width", xScale1.bandwidth())
            .attr("height", d => {
                return 0
            })
            .transition()
            .delay("200")
            .duration("700")
            .attr('height', d => toShow.filter(s => s.id == d.name)[0] ? height - 60 - toShow.filter(s => s.id == d.name)[0](d.France) : 0)

            nutrient_name.selectAll(".bar.Germany")
            .data(d => [d])
            .enter()
            .append("rect")
            .attr("class", "bar Germany")
            .style("fill",d3.rgb(255, 160, 0))
            .attr("x", d => xScale1('Germany'))
            .attr("y", d => scales.filter(s => s.id == d.name)[0](d.Germany))
            .attr("width", xScale1.bandwidth())
            .attr("height", d => {
                return 0
            })
            .transition()
            .delay("200")
            .duration("700")
            .attr('height', d => toShow.filter(s => s.id == d.name)[0] ? height - 60 - toShow.filter(s => s.id == d.name)[0](d.Germany) : 0)

            nutrient_name.selectAll(".bar.Italy")
            .data(d => [d])
            .enter()
            .append("rect")
            .attr("class", "bar Italy")
            .style("fill",d3.rgb(255, 255, 0))
            .attr("x", d => xScale1('Italy'))
            .attr("y", d => scales.filter(s => s.id == d.name)[0](d.Italy))
            .attr("width", xScale1.bandwidth())
            .attr("height", d => {
                return 0
            })
            .transition()
            .delay("200")
            .duration("700")
            .attr('height', d => toShow.filter(s => s.id == d.name)[0] ? height - 60 - toShow.filter(s => s.id == d.name)[0](d.Italy) : 0)

            nutrient_name.selectAll(".bar.Netherlands")
            .data(d => [d])
            .enter()
            .append("rect")
            .attr("class", "bar Netherlands")
            .style("fill",d3.rgb(160, 255, 0))
            .attr("x", d => xScale1('Netherlands'))
            .attr("y", d => scales.filter(s => s.id == d.name)[0](d.Netherlands))
            .attr("width", xScale1.bandwidth())
            .attr("height", d => {
                return 0
            })
            .transition()
            .delay("200")
            .duration("700")
            .attr('height', d => toShow.filter(s => s.id == d.name)[0] ? height - 60 - toShow.filter(s => s.id == d.name)[0](d.Netherlands) : 0)

            nutrient_name.selectAll(".bar.Sweden")
            .data(d => [d])
            .enter()
            .append("rect")
            .attr("class", "bar Sweden")
            .style("fill",d3.rgb(80, 255, 0))
            .attr("x", d => xScale1('Sweden'))
            .attr("y", d => scales.filter(s => s.id == d.name)[0](d.Sweden))
            .attr("width", xScale1.bandwidth())
            .attr("height", d => {
                //console.log(d)
                return 0
            })

            .transition()
            .delay("200")
            .duration("700")
            .attr('height', d => toShow.filter(s => s.id == d.name)[0] ? height - 60 - toShow.filter(s => s.id == d.name)[0](d.Sweden) : 0)

            nutrient_name.selectAll(".bar.UK")
            .data(d => [d])
            .enter()
            .append("rect")
            .attr("class", "bar UK")
            .style("fill",d3.rgb(0, 255, 0))
            .attr("x", d => xScale1('UK'))
            .attr("y", d => scales.filter(s => s.id == d.name)[0](d.UK))
            .attr("width", xScale1.bandwidth())
            .attr("height", d => {
                return 0
            })
            .transition()
            .delay("200")
            .duration("700")
            .attr('height', d => toShow.filter(s => s.id == d.name)[0] ? height - 60 - toShow.filter(s => s.id == d.name)[0](d.UK) : 0)

        // X轴
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(40,${height - 50})`)
            .transition()
            .delay("0")
            .duration("700")
            .call(xAxis);

        let graphs = svg.selectAll(".nutrient_name")

        graphs = (graphs._groups[0])
        count = 0

        // Y轴（动态添加）
        graphs.forEach(g => {
            let trans = (d3.select(g).attr("transform"))
            let translate = trans.substring(trans.indexOf("(")+1, trans.indexOf(")")).split(",");
            let ax
            if(count < 16){
                axises.forEach(a => {if(a.id ==  g.__data__.name)
                    ax = a
                })
                svg.append("g")
                .attr("class", "y axis")
                    .attr("transform", `translate(${translate[0]- 10} , 10)`)
                    .transition()
                    .duration("700")

                    .call(ax)

            }
            count++

        })

        //图例 绘制
        svg.append("rect").attr("width", 12).attr("height", 12)
        .attr("transform", `translate(${width/1.01}, 10)`)
        .style("fill",this.cou == "芬兰" || this.cou == null ? d3.rgb(255, 0, 0) : "none")
        svg.append("text").attr("transform", `translate(${15+width/1.01}, 21)`).text(this.cou == "芬兰" || this.cou == null ? "芬兰" : "").style("font-size", "14px").style("fill", d3.rgb(255, 0, 0))

        svg.append("rect").attr("width", 12).attr("height", 12)
        .attr("transform", `translate(${width/1.01}, 25)`)
        .style("fill",this.cou == "法国" || this.cou == null ? d3.rgb(255, 80, 0) : "none")
        svg.append("text").attr("transform", `translate(${15+width/1.01}, 36)`).text(this.cou == "法国" || this.cou == null ? "法国" : "").style("font-size", "14px").style("fill", d3.rgb(255, 80, 0))

        svg.append("rect").attr("width", 12).attr("height", 12)
        .attr("transform", `translate(${width/1.01}, 40)`)
        .style("fill",this.cou == "德国" || this.cou == null ? d3.rgb(255, 160, 0) : "none")
        svg.append("text").attr("transform", `translate(${15+width/1.01}, 51)`).text(this.cou == "德国" || this.cou == null ? "德国" : "").style("font-size", "14px").style("fill", d3.rgb(255, 160, 0))

        svg.append("rect").attr("width", 12).attr("height", 12)
        .attr("transform", `translate(${width/1.01}, 55)`)
        .style("fill",(this.cou == "意大利" || this.cou == null ? d3.rgb(255, 255, 0) : "none"))
        svg.append("text").attr("transform", `translate(${15+width/1.01}, 66)`).text(this.cou == "I意大利" || this.cou == null ? "意大利" : "").style("font-size", "14px").style("fill", d3.rgb(255, 255, 0))

        svg.append("rect").attr("width", 12).attr("height", 12)
        .attr("transform", `translate(${width/1.01}, 70)`)
        .style("fill",(this.cou == "意大利" || this.cou == null ? d3.rgb(160, 255, 0) : "none"))
        svg.append("text").attr("transform", `translate(${15+width/1.01}, 81)`).text(this.cou == "意大利" || this.cou == null ? "意大利" : "").style("font-size", "14px").style("fill", d3.rgb(160, 255, 0))

        svg.append("rect").attr("width", 12).attr("height", 12)
        .attr("transform", `translate(${width/1.01}, 85)`)
        .style("fill",this.cou == "瑞典" || this.cou == null ? d3.rgb(80, 255, 0) : "none")
        svg.append("text").attr("transform", `translate(${15+width/1.01}, 96)`).text(this.cou == "瑞典" || this.cou == null ? "瑞典" : "").style("font-size", "14px").style("fill", d3.rgb(80, 255, 0))

        svg.append("rect").attr("width", 12).attr("height", 12)
        .attr("transform", `translate(${width/1.01}, 100)`)
        .style("fill",this.cou == "英国" || this.cou == null ? d3.rgb(0, 255, 0) : "none")
        svg.append("text").attr("transform", `translate(${15+width/1.01}, 111)`).text(this.cou == "英国" || this.cou == null ? "英国" : "").style("font-size", "14px").style("fill", d3.rgb(0, 255, 0))

        return
    }
}