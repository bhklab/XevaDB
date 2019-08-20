const csv = require('fast-csv')
const fs = require('fs')

const results = [];

var csvStream = csv.createWriteStream({headers: ["Drug","X-1004","X-1008","X-1286","X-1298","X-1349","X-1371","X-1383","X-1407","X-1468","X-1600","X-1631","X-1828","X-1832","X-1916","X-1921","X-2127","X-2195","X-2344","X-2353","X-2487","X-2524","X-2640","X-2780","X-3077","X-3078","X-3201","X-3298","X-3450","X-3453","X-3468","X-3697","X-3873","X-4347","X-4567","X-4824","X-4888","X-4949","X-5249","X-5355","X-5502","X-5541","X-5975","X-6047"]});
var writableStream = fs.createWriteStream("./heatmap_data.csv");

fs.createReadStream('./mRECIST.csv')
.pipe(csv({delimiter:"\t"}))
  .on('data', function(data) {
      results.push(data);
  })
  .on('end', () => {
    csvStream.pipe(writableStream);
    results.map((data) => {
        if (data[0] == "X-1004") {}
        else {
            csvStream.write({Drug:data[0],"X-1004":data[1],"X-1008":data[2],"X-1286":data[3],"X-1298":data[4],"X-1349":data[5],"X-1371":data[6],"X-1383":data[7],"X-1407":data[8],"X-1468":data[9],"X-1600":data[10],"X-1631":data[11],"X-1828":data[12],"X-1832":data[13],"X-1916":data[14],"X-1921":data[15],"X-2127":data[16],"X-2195":data[17],"X-2344":data[18],"X-2353":data[19],"X-2487":data[20],"X-2524":data[21],"X-2640":data[22],"X-2780":data[23],"X-3077":data[24],"X-3078":data[25],"X-3201":data[26],"X-3298":data[27],"X-3450":data[28],"X-3453":data[29],"X-3468":data[30],"X-3697":data[31],"X-3873":data[32],"X-4347":data[33],"X-4567":data[34],"X-4824":data[35],"X-4888":data[36],"X-4949":data[37],"X-5249":data[38],"X-5355":data[39],"X-5502":data[40],"X-5541":data[41],"X-5975":data[42],"X-6047":data[43]});
        }
    })
  })


