import EventListener from "./EventListener.js";

export default class Radar_Chart extends EventListener {
    #svg;
    #axes;
    #selection = [];

    #angle_scale;
    #radius;
    #line_groups;

    #margin = 25;
    #scroll_factor = 1;

    constructor(svg, axes) {
        super();
        this.#svg = svg;
        this.#axes = axes;

        this.init();
    }

    init() {
        this.#svg
            .on("click", () => {
                this.emit("navigate-out", []);
            })
            .on("wheel", e => {
                this.#scroll_factor /= Math.pow(1.001, e.deltaY);
                this.draw(100);
            });

        this.#angle_scale = d3.scaleLinear()
            .domain([0, this.#axes.length])
            .range([0, Math.PI * 2]);
    }

    draw(time) {
        let size = this.#svg.node().getBoundingClientRect();

        this.#radius = Math.min(size.width, size.height) / 2;

        this.#svg
            .select("g.main")
            .attr("transform", `translate(${size.width / 2} ${size.height / 2})`);

        let rdi_scale = d3.scaleLinear()
            .range([this.#margin, this.#margin + (this.#radius - 2 * this.#margin) * this.#scroll_factor])
            .domain([0, d3.max(this.#selection, item => d3.max(this.#axes, axis => item.nutrients.get(axis.id) / axis.rdi))])
            .nice();

        let line_generator = d3.lineRadial()
            .curve(d3.curveLinearClosed)
            .radius((value, i) => rdi_scale(value / this.#axes[i].rdi))
            .angle((_, i) => this.#angle_scale(i));

        this.create_axes(rdi_scale, time);

        // Process the data

        this.#line_groups.transition()
            .duration(time)
            .attr("stroke", (_, i) => d3.interpolateRainbow(i / this.#selection.length))
            .attr("fill", (_, i) => d3.interpolateRainbow(i / this.#selection.length));

        this.#line_groups.select("title")
            .text(d => `${d.name} | ${d.count}`);

        this.#line_groups.select("path")
            .transition()
            .duration(time)
            .attr("d", d => line_generator(d.nutrients.values()));

        this.#line_groups
            .selectAll(".circles circle")
            .data(d => d.nutrients.values())
            .transition()
            .duration(time)
            .attr("cx", (d, i) => rdi_scale(d / this.#axes[i].rdi) * Math.cos(this.#angle_scale(i) - Math.PI / 2))
            .attr("cy", (d, i) => rdi_scale(d / this.#axes[i].rdi) * Math.sin(this.#angle_scale(i) - Math.PI / 2))
    }

    set selection(selection) {
        let radar_plot = this;

        let zero_line = d3.line().curve(d3.curveLinearClosed)(this.#axes.map(_ => [0, 0]));

        this.#selection = selection;
        this.#scroll_factor = 1;

        function create_line_group(enter) {
            let group = enter.append("g")
                .classed("line", true)
                .on("mouseover", function () {
                    d3.select(this).raise();
                })
                .on("click", (event, datum) => {
                    radar_plot.emit("navigate-in", [datum]);
                    event.stopPropagation();
                })
                .attr("stroke", "black")
                .attr("fill", "black");

            group.append("title");

            group.append("path")
                .attr("d", zero_line);

            let circle_group = group.append("g")
                .classed("circles", true);

            circle_group.selectAll("circle")
                .data(d => d.nutrients)
                .join("circle")
                .attr("cx", 0)
                .attr("cy", 0);

            return group;
        }

        function remove_line_group(remove) {
            remove.transition()
                .duration(1000)
                .attr("fill", "black")
                .attr("stroke", "black")
                .remove();
            remove.select("path")
                .transition()
                .duration(1000)
                .attr("d", zero_line);
            remove.selectAll("circle")
                .transition()
                .duration(1000)
                .attr("cx", 0)
                .attr("cy", 0);
        }

        this.#line_groups = this.#svg.select("g.lines")
            .selectAll("g.line")
            .data(this.#selection, item => item.name)
            .join(
                create_line_group,
                x => x,
                remove_line_group,
            );

        this.draw(1000);
    }

    create_axes(rdi_scale, time) {
        let axes_group = d3.select("svg g.main g.axes");

        let chart = this;

        axes_group.selectAll(".axis")
            .data(this.#axes)
            .join(enter => {
                let group = enter.append("g")
                    .classed("axis", true);

                let label = group.append("text")
                    .classed("label", true)
                    .text("Hello");

                label.append("title");

                return group;
            })
            .each(function (axis, i) {
                chart.create_axis(this, axis, i, rdi_scale, time);
            });

        axes_group.select(".reference")
            .transition()
            .duration(time)
            .attr("r", rdi_scale(1));
    }

    create_axis(element, axis, i, rdi_scale, time) {
        let transform = 1;
        let axis_type = d3.axisBottom;
        if (i >= this.#axes.length / 2) {
            transform = -1;
            axis_type = d3.axisTop;
        }

        let axis_scale = d3.scaleLinear()
            .domain([0, rdi_scale.domain()[1] * axis.rdi / this.#scroll_factor])
            .range([transform * this.#margin, transform * (this.#radius - this.#margin)]);

        d3.select(element)
            .attr("transform", `rotate(${-90 * transform + 360 / this.#axes.length * i})`)
            .transition()
            .duration(time)
            .attr("font-size", Math.min(this.#radius / 25, 40))
            .call(axis_type(axis_scale).ticks(5));

        let text_element = d3.select(element).select("text").node();

        text_element.firstChild.nodeValue = axis.name;

        d3.select(text_element)
            .attr("font-size", Math.min(this.#radius / 25, 40))
            .transition()
            .duration(time)
            .attr("x", (this.#radius - this.#margin - text_element.getBBox().width / 2) * transform)
            .attr("y", -5 * transform + (1 - transform) / 2 * text_element.getBBox().height / 2);

        d3.select(text_element)
            .select("title")
            .text(`${axis.full_name} (${axis.unit})`);
    }
}
