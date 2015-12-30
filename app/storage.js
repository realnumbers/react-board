try {
  var busstopList = JSON.parse(localStorage.busstops) || undefined;
}
catch (e) {
  var busstopList = undefined;
}

function getBusstops(id) {
  if(id && busstopList)
    return busstopList[id] || {};
  else
    return busstopList;
}

function saveBusstops(list) {
  localStorage.busstops = JSON.stringify(list);
  busstopList = list;
}

module.exports.busstops = {};
module.exports.busstops.get = getBusstops;
module.exports.busstops.save = saveBusstops;
