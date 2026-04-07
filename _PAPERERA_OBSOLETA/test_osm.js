import fetch from 'node-fetch';

async function testOSM() {
    const res = await fetch('https://nominatim.openstreetmap.org/search?city=Plasencia&country=España&format=json&addressdetails=1');
    const data = await res.json();
    console.log(JSON.stringify(data[0].address, null, 2));
}

testOSM();
