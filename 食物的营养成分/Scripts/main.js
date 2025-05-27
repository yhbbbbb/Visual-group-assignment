import DataLoading from "./DataLoading"

    let axes = [
        { id: "56",    name: "Ca",               full_name: "Calcium (Ca)",                                                unit: "毫克/ 100克", rdi: 1200 }, // https://ods.od.nih.gov/factsheets/Calcium-Consumer/
        { id: "18",    name: "Cu",               full_name: "Copper (Cu)",                                                 unit: "毫克/ 100克", rdi: 900 }, // https://ods.od.nih.gov/factsheets/Copper-Consumer/
        { id: "167",   name: "Mg",               full_name: "Magnesium (Mg)",                                              unit: "毫克/ 100克", rdi: 375 }, // https://ods.od.nih.gov/factsheets/Magnesium-Consumer/
        { id: "73",    name: "P",                full_name: "Phosphorus (P)",                                              unit: "毫克/ 100克", rdi: 1000 }, // https://ods.od.nih.gov/factsheets/Phosphorus-Consumer/
        { id: "161",   name: "K",                full_name: "Potassium (K)",                                               unit: "毫克/ 100克", rdi: 3000 }, // https://ods.od.nih.gov/factsheets/Potassium-Consumer/
        { id: "34",    name: "Zn",               full_name: "Zinc (Zn)",                                                   unit: "毫克/ 100克", rdi: 10 }, // https://ods.od.nih.gov/factsheets/Zinc-Consumer/
        { id: "43",    name: "Fe",                full_name: "Total iron",                                                  unit: "毫克/ 100克", rdi: 15 }, // https://ods.od.nih.gov/factsheets/Iron-Consumer/
        { id: "529",   name: "Se",               full_name: "Total Selenium",                                              unit: "毫克/ 100克", rdi: 55 }, // https://ods.od.nih.gov/factsheets/Selenium-Consumer/
        { id: "14176", name: "V-B1",               full_name: "Thiamin",                                                     unit: "毫克/ 100克", rdi: 1.2 }, // https://ods.od.nih.gov/factsheets/Thiamin-Consumer/
        { id: "14150", name: "V-B2",               full_name: "Riboflavin",                                                  unit: "毫克/ 100克", rdi: 1.2 }, // https://ods.od.nih.gov/factsheets/Riboflavin-Consumer/
        { id: "14112", name: "V-B3",               full_name: "Niacin equivalents, total",                                   unit: "毫克/ 100克", rdi: 15 }, // https://ods.od.nih.gov/factsheets/Niacin-Consumer/
        { id: "14190", name: "V-B6",               full_name: "Vitamin B-6, total",                                          unit: "毫克/ 100克", rdi: 1.3 }, // https://ods.od.nih.gov/factsheets/VitaminB6-Consumer/
        { id: "14189", name: "V-B12",              full_name: "Vitamin B-12",                                                unit: "毫克/ 100克", rdi: 2.4 }, // https://ods.od.nih.gov/factsheets/VitaminB12-Consumer/
        { id: "14193", name: "V-E",                full_name: "Vitamin E; alpha-tocopherol equiv from E vitamer activities", unit: "毫克/ 100克", rdi: 15 }, // https://ods.od.nih.gov/factsheets/VitaminE-Consumer/
        { id: "13727", name: "α-生育酚",          full_name: "Alpha-tocopherol",                                            unit: "毫克/ 100克", rdi: 15 }, // https://ods.od.nih.gov/factsheets/VitaminE-Consumer/
        { id: "14194", name: "K",                full_name: "Vitamin K, total",                                            unit: "毫克/ 100克", rdi: 105 }, // https://ods.od.nih.gov/factsheets/vitaminK-Consumer/
    ];

    let data_reader = new DataLoading()
    data_reader.promise.then(result => {
    barChart = new topBarChart(d3.select("svg.bars"),null, null, null, null, null, data_loading) // 初始化柱状图
    selectorChart = new SelectorChart(d3.select("svg.bubbles"), data_reader) // 初始化选择器
});
