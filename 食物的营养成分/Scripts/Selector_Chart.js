import EventListener from "./EventListener.js";
import Send_Selected from "./main.js";

export default class Selector_Chart  extends EventListener {
    #svg;

    width = 500
    height = 500


    view
    node
    label
    globalFocus
    food_selected

    text_element

        constructor(svg, dataReader) {
            super()
            this.#svg = svg;
            this.data_reader = dataReader
            this.init()
            this.food_selected = new Map()
        }

        async init() {
            let color = d3.scaleLinear()
                .domain([0, 5])
                .range(["rgb(35,35,35)", "rgb(255,255,255)"])
                .interpolate(d3.interpolateHcl)

            let data = await this.data_reader.Data_Hierarchy()

            let pack = data => d3.pack()
                .size([this.width, this.height])
                .padding(3)
            (d3.hierarchy(data)
                .sum(d => d.value)
                .sort((a, b) => b.value - a.value))

            const root = pack(data);
            this.globalFocus = root
            let focus = root

            this.#svg
                .attr("viewBox", `-${this.width / 2} -${this.height / 2} ${this.width} ${this.height}`)
                .style("display", "block")
                .style("background", color(0))
                .style("cursor", "pointer")
                .on("click", (event) => this.zoom(event, root))

           this.node = this.#svg.append("g")
                .selectAll("circle")
                .data(root.descendants().slice(1))
                .join("circle")
                .attr("fill", d => d.children ? color(d.depth) :
                      (this.food_selected.has(d.data.name) ? "black" : "white"))
                // 鼠标悬停效果（带过渡动画）
                .on("mouseover", function(event, d) {
                  d3.select(this)
                    .transition()
                    .duration(300) // 动画时长300ms
                    .ease(d3.easeCubicOut) // 缓动函数
                    .attr("fill", "#ffcccc") // 淡红色
                    .attr("stroke", "#000")
                    .attr("stroke-width", 1.5);

                })
                // 鼠标移出效果（带过渡动画）
                .on("mouseout", (event, d) => { // 使用箭头函数保持this上下文
                  d3.select(event.currentTarget)
                    .transition()
                    .duration(200)
                    .ease(d3.easeCubicOut)
                    .attr("fill", d.children
                      ? color(d.depth)
                      : (this.food_selected.has(d.data.name) ? "black" : "white"))
                    .attr("stroke", null);
                })
                .on("click", (event, d) =>
                  (focus !== d) && (this.zoom(event, d), event.stopPropagation())
                );
            this.label = this.#svg.append("g")
                    .style("font", "10px sans-serif")
                    .attr("pointer-events", "none")
                    .attr("text-anchor", "middle")
                  .selectAll("text")
                  .data(root.descendants())
                  .join("text")
                    .style("fill-opacity", d => d.parent === root ? 1 : 0)
                    .style("display", d => d.parent === root ? "inline" : "none")
                    .style('fill', 'black')
                    .text(d => "");
                    //.text(d => d.data.name);

            this.text_element = this.#svg
                .append("text")
                .text("总体概览")
                .attr("x", -245)
                .attr("y", -234)
                .attr("font-family", "sans-serif")
                .attr("font-size", "11px")
                .attr("fill", "white");

            this.zoomTo([root.x, root.y, root.r * 2]);

            return this.#svg.node();
        }

        zoomTo(v) {
            const k = this.width / v[2];
            this.view = v;
            this.label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
            this.node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
            this.node.attr("r", d => d.r * k);
        }

        zoom(event, d) {
            focus = d;

            this.export_selection(focus)
            if (!d.children){focus = d.parent}
            const transition = this.#svg.transition()
                .duration(event.altKey ? 7500 : 750)
                .tween("zoom", d => {
                    const i = d3.interpolateZoom(this.view, [focus.x, focus.y, focus.r * 2]);
                    return t => this.zoomTo(i(t));
                });

            this.label
                .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
                .transition(transition)
                .style("fill-opacity", d => d.parent === focus ? 1 : 0)
                .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
                .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });

        }

        zoomByCat(category1, category2, category3){
            if(category1 && !category2 && !category3){
                this.node._groups[0].forEach(element => {
                    if(element.__data__.data.name == category1 && element.__data__.depth == 1){
                        this.zoom({altKey : false},element.__data__)
                    }
                });
            }
            if(category1 && category2 && !category3){
                this.node._groups[0].forEach(element => {
                    if(element.__data__.data.name == category2 && element.__data__.depth == 2){
                        this.zoom({altKey : false},element.__data__)
                    }
                });
            }
            if(category1 && category2 && category3){
                this.node._groups[0].forEach(element => {
                    if(element.__data__.data.name == category3 && element.__data__.depth == 3){
                        this.zoom({altKey : false},element.__data__)
                    }
                });
            }
            if(!category1){
                this.zoom({altKey : false}, this.globalFocus)
            }


        }

        export_selection(focus){
            if (focus.data.name == "root"){
                this.text_element.text("总体概览")
            }

            let controls = d3.select("body > .layout > .controls");

            if (focus.height == 4){
                Send_Selected(null, null, null, focus.data.name, "全局浏览" )
            }
            if (focus.height == 3){
                this.text_element.text("Selected level 1: " + focus.data.name)

                let category1_control = controls.select(".category1");
                category1_control.property("value", focus.data.name ?? "Something went wrong");
                Send_Selected(focus.data.name, null, null, null, "Selected level 1: " + focus.data.name)
            }
            if (focus.height == 2){
                this.text_element.text("Selected level 2: " + focus.data.name)
                let category2_control = controls.select(".category2");
                category2_control.property("value", focus.data.name ?? "Something went wrong");
                Send_Selected(focus.parent.data.name, focus.data.name, null, null, "Selected level 2: " + focus.data.name)
            }
            if (focus.height == 1){
                this.text_element.text("Selected level 3: " + focus.data.name )

                let category3_control = controls.select(".category3");
                category3_control.property("value", focus.data.name ?? "Something went wrong");
                Send_Selected(focus.parent.parent.data.name, focus.parent.data.name, focus.data.name, null, "Selected level 3: " + focus.data.name)
            }
            if (focus.height == 0){
                this.text_element.text("Selected food: " + focus.data.name)
                Send_Selected(focus.parent.parent.parent.data.name, focus.parent.parent.data.name, focus.parent.data.name, focus.data.name, "Selected food: " + focus.data.name)
            }

        }

    }
