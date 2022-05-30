const { TenorClient } = korequire("node-tenor");

async function main() {
    const client = new TenorClient();
    const { results } = await client.fetchTrending({ limit: 10 });

    console.log(results);
}

main();

// module.exports = async function () {
    
// }