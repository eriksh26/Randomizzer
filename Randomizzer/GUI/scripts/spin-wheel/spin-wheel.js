let data = localStorage.getItem("Items");
if (!data) {
    data = '[{"label":"Item1"},{"label":"Item2"},{"label":"Item3"},{"label":"Item4"},{"label":"Item5"}]';
    localStorage.setItem("Items", data);
}
data = JSON.parse(data);

window.addEventListener('load', () => {
    renderSpinWheel();
})

document.getElementById('edit-btn').addEventListener('click', () => {
    const spinContainer = document.getElementById('spin-container')
    spinContainer.style.display = `none`;

    const editItemsContainer = document.getElementById('editItems-container')
    editItemsContainer.style.display = `flex`;

    disableSwipe();
    renderItemsList();
})

document.getElementById('spin-btn').addEventListener('click', async () => {
    await spin();
})

let vis, padding, svg, container, pie, arc, arcs;

async function renderSpinWheel() {

    const chartDiv = document.getElementById('chart');
    chartDiv.innerHTML = ''

    padding = {
            top: 20,
            right: 40,
            bottom: 0,
            left: 0
        },
        w = Math.min(window.innerWidth, 350) - padding.left - padding.right;
    h = Math.min(window.innerHeight, 350) - padding.top - padding.bottom;
    r = Math.min(w, h) / 2,
        rotation = 0,
        oldrotation = 0,
        picked = 100000,
        oldpick = [],
        color = d3.scale.category20(); //category20c()


    svg = await d3.select('#chart')
        .append("svg")
        .data([data])
        .attr("width", w + padding.left + padding.right)
        .attr("height", h + padding.top + padding.bottom)
        .style({
            // "border": "1px solid black",
            "border-radius": "50%",
            "height": "350px",
            "width": "350px",
            // "padding-left": "4%",
            "box-shadow": "15px 15px 15px rgba(10, 99, 169, 0.16),-15px -15px 15px rgba(255, 255, 255, 0.7)",
        

        });



    container = await svg.append("g")
        .attr("class", "chartholder")
        .attr("transform", "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")")
        .style({
            "transform": "translate(175px,175px)",
            "box-shadow": "1px 1px 20px black",
        })


    vis = await container
        .append("g");

    pie = await d3.layout.pie().sort(null).value(function (d) {
        return 1;
    });

    // declare an arc generator function
    arc = await d3.svg.arc().outerRadius(r);

    // select paths, use arc generator to draw
    arcs = await vis.selectAll("g.slice")
        .data(pie)
        .enter()
        .append("g")
        .attr("class", "slice");

    await arcs.append("path")
        .attr("fill", function (d, i) {
            if (data.length % 2 != 0) {
                if (i % 3 == 0) {
                    return "rgb(201 201 201)"
                } else if (i % 2 == 0) {
                    return "rgb(240 240 240)"
                } else {
                    return "rgb(160 160 160)"
                }
            } else {
                return i % 2 == 0 ? "rgb(160 160 160)" : "rgb(220 220 220)";
            }
        })
        .attr("d", function (d) {
            return arc(d);
        });

    // add the text
    await arcs.append("text").attr("transform", function (d) {
            d.innerRadius = 0;
            d.outerRadius = r;
            d.angle = (d.startAngle + d.endAngle) / 2;
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius / 2 + 20) + ")";
        })
        .attr("text-anchor", "middle")
        .text(function (d, i) {
            return data[i].label;
        })
        .style({
            "font-weight": "700",
            "fill": "rgb(50, 50, 50)"
        })

    //draw spin circle
    await container.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 35)
        .style({
            "stroke": "rgba(0, 0, 0, 0.18)",
            "stroke-width": "2px",
            "fill": "white",
            "cursor": "pointer",
            "padding-bottom": "10px"

        });

    // create new circle for ::before style
    await container.append("circle")
        .attr("cx", 0)
        .attr("cy", -40)
        .attr("r", 20)
        .style({
            "position": " absolute",
            "width": " 20px",
            "height": " 30px",
            "fill": "white",
            "clip-path": "polygon(50% 0%, 26% 100%, 77% 100%)"
        });




}

function rotTween(to) {
    var i = d3.interpolate(oldrotation % 360, rotation);
    return function (t) {
        return "rotate(" + i(t) + ")";
    };
}

function spin(d) {
    var ps = 360 / data.length,
        pieslice = Math.round(1440 / data.length),
        rng = Math.floor((Math.random() * 1440) + 360);

    if ((data.length / 6) % 2 != 0 && (data.length % 6) == 0) {
        rotation = (Math.round(rng / ps) * ps) + 35;
    } else {
        rotation = (Math.round(rng / ps) * ps) + rng;
    }

    picked = Math.round(data.length - (rotation % 360) / ps);
    picked = picked >= data.length ? (picked % data.length) : picked;
    oldpick.push(picked);
    rotation += 90 - Math.round(ps / 2);
    vis.transition()
        .duration(3000)
        .attrTween("transform", rotTween)
        .ease('cubic-out')
        .each("end", function () {
            //mark question as seen
            d3.select(".slice:nth-child(" + (picked + 1) + ") path")
            //populate question
            d3.select("#question h1")
                .text(data[picked].question);
            oldrotation = rotation;

            /* Get the result value from object "data" */
            console.log(data[picked].value)
        });
}