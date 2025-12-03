<template>
  <div id="map"></div>
</template>

<script setup>
import bus from '../../libs/eventbus'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-editable'
import { ref, onMounted, onUnmounted } from 'vue'

const map = ref(null);
const pointLngLat = ref([]);
const polylineCoordinates = ref([])
const polygonCoordinates = ref([])
const distancelength = ref(null);
const calculatePolygonArea = ref(null);
const startDrawPointFunction = ref(false)
const startDrawPolylineFunction = ref(false)
const startDrawPolygonFunction = ref(false)

// 存储地图事件处理函数（用于后续解绑）
const mapEventHandlers = ref({
  pointClick: null,
  lineClick: null,
  lineMousemove: null,
  lineContextmenu: null,
  polygonClick: null,
  polygonMousemove: null,
  polygonDblclick: null
});

// 封装获取map DOM的工具函数（统一判空）
const getMapDom = () => {
  return document.getElementById('map');
};

const initMap = () => {
  if (map.value) return;
  const mapDom = getMapDom();
  if (!mapDom) return; // 新增：DOM不存在则终止初始化

  map.value = L.map('map', {
    center: [28.927237, 120.187512],
    zoom: 17,
    maxZoom: 21,
    minZoom: 15,
    logoControl: false,
    zoomControl: false,
    doubleClickZoom: false,
    attributionControl: false,
    preferCanvas: true,
    editable: true
  })
  const tainditu = L.tileLayer(
    "https://t{s}.tianditu.gov.cn/" +
    "img" +
    "_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=" +
    "img" +
    "&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=d4782516c98542ebc0bdc11ec86b68ca",
    {
      subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
      isBaseMap: true,
      maxNativeZoom: 18,
      maxZoom: 21,
    }
  )
  const taindituLabel = L.tileLayer(
    "https://t{s}.tianditu.gov.cn/" +
    "cia" +
    "_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=" +
    "cia" +
    "&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=d4782516c98542ebc0bdc11ec86b68ca",
    {
      subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
      isBaseMap: true,
      maxNativeZoom: 18,
      maxZoom: 21,
    }
  )
  tainditu.addTo(map.value);
  taindituLabel.addTo(map.value);
  map.value.editable = new L.Editable(map.value, {
    position: 'topright',
    edit: { marker: true }
  });

  L.tileLayer.wms('http://127.0.0.1:8080/geoserver/fangyan/wms?', {
    layers: 'fangyan:dom',
    format: 'image/png',
    maxZoom: 21,
    transparent: true,
    tileSize: 256,
    continuousWorld: true,
    noWrap: true,
  }).addTo(map.value);
}

// 停止所有绘制（核心修复：所有DOM操作先判空）
const stopAllDrawing = () => {
  // 1. 先判空map实例
  if (!map.value) {
    // 即使map实例不存在，也要尝试恢复鼠标样式（判空DOM）
    const mapDom = getMapDom();
    if (mapDom) mapDom.style.cursor = 'grab';
    return;
  }

  // 2. 解绑所有地图事件
  if (mapEventHandlers.value.pointClick) {
    map.value.off('click', mapEventHandlers.value.pointClick);
    mapEventHandlers.value.pointClick = null;
  }
  if (mapEventHandlers.value.lineClick) {
    map.value.off('click', mapEventHandlers.value.lineClick);
    mapEventHandlers.value.lineClick = null;
  }
  if (mapEventHandlers.value.lineMousemove) {
    map.value.off('mousemove', mapEventHandlers.value.lineMousemove);
    mapEventHandlers.value.lineMousemove = null;
  }
  if (mapEventHandlers.value.lineContextmenu) {
    map.value.off('contextmenu', mapEventHandlers.value.lineContextmenu);
    mapEventHandlers.value.lineContextmenu = null;
  }
  if (mapEventHandlers.value.polygonClick) {
    map.value.off('click', mapEventHandlers.value.polygonClick);
    mapEventHandlers.value.polygonClick = null;
  }
  if (mapEventHandlers.value.polygonMousemove) {
    map.value.off('mousemove', mapEventHandlers.value.polygonMousemove);
    mapEventHandlers.value.polygonMousemove = null;
  }
  if (mapEventHandlers.value.polygonDblclick) {
    map.value.off('dblclick', mapEventHandlers.value.polygonDblclick);
    mapEventHandlers.value.polygonDblclick = null;
  }

  // 3. 移除自定义绘制图层（判空map.value）
  map.value.eachLayer(layer => {
    const isPointLayer = layer.options?.icon?.options?.title === '点图片';
    const isLineOrPolygonLayer = layer.options?.title === '线' || layer.options?.title === '面';
    if (isPointLayer || isLineOrPolygonLayer) {
      map.value.removeLayer(layer);
    }
  });

  // 4. 重置状态变量
  pointLngLat.value = [];
  polylineCoordinates.value = [];
  polygonCoordinates.value = [];
  distancelength.value = null;
  calculatePolygonArea.value = null;

  // 5. 恢复鼠标样式（核心修复：先判空DOM）
  const mapDom = getMapDom();
  if (mapDom) {
    mapDom.style.cursor = 'grab';
  }

  // 6. 禁用双击放大（判空）
  if (map.value.doubleClickZoom) {
    map.value.doubleClickZoom.disable();
  }
};

const startDrawPoint = () => {
  stopAllDrawing();
  const mapDom = getMapDom();
  if (!mapDom) return; // 新增：DOM不存在则终止

  let pointIcon = L.icon({
    title: '点图片',
    iconUrl: "/poi.png",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })
  // 修复：判空后设置cursor
  mapDom.style.cursor = 'crosshair';

  mapEventHandlers.value.pointClick = (e) => {
    pointLngLat.value = [e.latlng.lng, e.latlng.lat];
    const point = L.marker(e.latlng, {
      draggable: true,
      icon: pointIcon
    }).addTo(map.value);
    point.enableEdit();
    map.value.off('click', mapEventHandlers.value.pointClick);
    mapEventHandlers.value.pointClick = null;

    // 修复：判空后恢复cursor
    if (mapDom) mapDom.style.cursor = 'grab';

    point.on("dragend", (e) => {
      pointLngLat.value = []
      const newLatLng = e.target.getLatLng();
      pointLngLat.value.push(newLatLng.lng)
      pointLngLat.value.push(newLatLng.lat)
      bus.emit('draw-result', { type: 'point', coordinates: pointLngLat.value, status: startDrawPointFunction.value });
    });
    bus.emit('draw-result', { type: 'point', coordinates: pointLngLat.value, status: startDrawPointFunction.value });
  };

  map.value.on("click", mapEventHandlers.value.pointClick);
};

// 开始绘制线
const startDrawLine = () => {
  stopAllDrawing()
  const mapDom = getMapDom();
  if (!mapDom || !map.value) return; // 新增：判空

  const polylineOption = {
    title: '线',
    stroke: true,
    color: 'red',
    weight: 2
  };
  const latlngs = [];
  const polyline = L.polyline(latlngs, polylineOption);
  const tempLine = L.polyline([], polylineOption);

  // 修复：判空后设置cursor
  if (mapDom) mapDom.style.cursor = 'crosshair';

  mapEventHandlers.value.lineClick = e => {
    latlngs.push([e.latlng.lat, e.latlng.lng]);
    polyline.addLatLng(e.latlng);
    polyline.addTo(map.value);
    polylineCoordinates.value = latlngs
    distancelength.value = calculateDistance(latlngs);
  };

  mapEventHandlers.value.lineMousemove = evt => {
    if (latlngs.length > 0) {
      const coords = [
        latlngs[latlngs.length - 1],
        [evt.latlng.lat, evt.latlng.lng]
      ];
      tempLine.setLatLngs(coords);
      map.value.addLayer(tempLine);
      const tempLatlngs = [...latlngs, [evt.latlng.lat, evt.latlng.lng]];
      distancelength.value = calculateDistance(tempLatlngs);
    }
  };

  mapEventHandlers.value.lineContextmenu = () => {
    // 修复：判空后恢复cursor
    if (mapDom) mapDom.style.cursor = 'grab';

    map.value.removeLayer(tempLine);
    polyline.enableEdit();

    polyline.on('editable:vertex:dragend', function (e) {
      polylineCoordinates.value = []
      const updatedLatLngs = polyline.getLatLngs();
      updatedLatLngs.forEach(e => {
        polylineCoordinates.value.push([e.lat, e.lng])
        distancelength.value = calculateDistance(polylineCoordinates.value);
      });
      bus.emit('draw-result', { type: 'polyline', coordinates: polylineCoordinates.value, length: distancelength.value.toFixed(3), status: startDrawPolylineFunction.value });
    })
    bus.emit('draw-result', { type: 'polyline', coordinates: polylineCoordinates.value, length: distancelength.value.toFixed(3), status: startDrawPolylineFunction.value });

    // 解绑线相关事件
    map.value.off('click', mapEventHandlers.value.lineClick);
    map.value.off('mousemove', mapEventHandlers.value.lineMousemove);
    map.value.off('contextmenu', mapEventHandlers.value.lineContextmenu);
    mapEventHandlers.value.lineClick = null;
    mapEventHandlers.value.lineMousemove = null;
    mapEventHandlers.value.lineContextmenu = null;
  };

  map.value.on("click", mapEventHandlers.value.lineClick);
  map.value.on("mousemove", mapEventHandlers.value.lineMousemove);
  map.value.on("contextmenu", mapEventHandlers.value.lineContextmenu);

  // 计算线的距离
  function calculateDistance (latlngs) {
    let totalDistance = 0;
    for (let i = 0; i < latlngs.length - 1; i++) {
      const point1 = L.latLng(latlngs[i]);
      const point2 = L.latLng(latlngs[i + 1]);
      totalDistance += point1.distanceTo(point2);
    }
    return totalDistance;
  }
}

// 开始绘制面
const startDrawPolygon = () => {
  stopAllDrawing()
  const mapDom = getMapDom();
  if (!mapDom || !map.value) return; // 新增：判空

  const latlngs = [];
  const polygonOption = {
    title: '面',
    stroke: true,
    color: '#ff0000',
    weight: 2,
    fillColor: '#00ff00',
    fillOpacity: 0.2
  };
  const tempLine = L.polyline([], polygonOption);
  const polygon = L.polygon(latlngs, polygonOption);

  // 修复：判空后设置cursor
  if (mapDom) mapDom.style.cursor = 'crosshair';

  mapEventHandlers.value.polygonDblclick = () => {
    // 修复：判空后恢复cursor
    if (mapDom) mapDom.style.cursor = 'grab';

    if (polygonCoordinates.value.length > 3) {
      polygonCoordinates.value.pop();
    }
    map.value.removeLayer(tempLine);
    polygon.enableEdit();

    polygon.on('editable:vertex:dragend', function (e) {
      polygonCoordinates.value = [];
      const updatedPolygonData = polygon.getLatLngs()[0];
      updatedPolygonData.forEach(e => {
        polygonCoordinates.value.push([e.lat, e.lng]);
      });
      if (polygonCoordinates.value.length > 0 &&
        polygonCoordinates.value[0].toString() === polygonCoordinates.value.at(-1).toString()) {
        polygonCoordinates.value.pop();
      }
      calculatePolygonArea.value = calculateArea(polygonCoordinates.value);
      bus.emit('draw-result', {
        type: 'polygon',
        coordinates: polygonCoordinates.value,
        area: calculatePolygonArea.value.toFixed(3),
        status: startDrawPolygonFunction.value
      });
    });

    bus.emit('draw-result', {
      type: 'polygon',
      coordinates: polygonCoordinates.value,
      area: calculatePolygonArea.value.toFixed(3),
      status: startDrawPolygonFunction.value
    });

    // 解绑面相关事件
    map.value.off('dblclick', mapEventHandlers.value.polygonDblclick);
    map.value.off('click', mapEventHandlers.value.polygonClick);
    map.value.off('mousemove', mapEventHandlers.value.polygonMousemove);
    mapEventHandlers.value.polygonDblclick = null;
    mapEventHandlers.value.polygonClick = null;
    mapEventHandlers.value.polygonMousemove = null;
    map.value.doubleClickZoom.disable();
  };

  mapEventHandlers.value.polygonClick = evt => {
    latlngs.push([evt.latlng.lat, evt.latlng.lng]);
    polygon.addLatLng(evt.latlng);
    if (!map.value.hasLayer(polygon)) {
      polygon.addTo(map.value);
    }
    polygonCoordinates.value = latlngs;
    calculatePolygonArea.value = calculateArea(latlngs);
  };

  mapEventHandlers.value.polygonMousemove = evt => {
    if (latlngs.length > 0) {
      tempLine.setLatLngs([
        latlngs[0],
        evt.latlng,
        latlngs[latlngs.length - 1]
      ]);
      if (!map.value.hasLayer(tempLine)) {
        map.value.addLayer(tempLine);
      }
      polygon.setLatLngs([...latlngs, evt.latlng]);
      const tempLatlngs = [...latlngs, [evt.latlng.lat, evt.latlng.lng]];
      calculatePolygonArea.value = calculateArea(tempLatlngs);
    }
  };

  map.value.on('dblclick', mapEventHandlers.value.polygonDblclick);
  map.value.on('click', mapEventHandlers.value.polygonClick);
  map.value.on('mousemove', mapEventHandlers.value.polygonMousemove);

  // 计算面积函数
  function calculateArea (latlngs) {
    const uniqueLatlngs = [...latlngs];
    if (uniqueLatlngs.length > 3 &&
      uniqueLatlngs[0].toString() === uniqueLatlngs.at(-1).toString()) {
      uniqueLatlngs.pop();
    }
    if (uniqueLatlngs.length < 3) {
      return 0;
    }
    let area = 0;
    for (let i = 0; i < uniqueLatlngs.length; i++) {
      const j = (i + 1) % uniqueLatlngs.length;
      area += uniqueLatlngs[i][0] * uniqueLatlngs[j][1] - uniqueLatlngs[j][0] * uniqueLatlngs[i][1];
    }
    area = Math.abs(area) / 2;
    const earthRadius = 6371000;
    area *= (Math.PI / 180) * (Math.PI / 180) * earthRadius * earthRadius;
    return area;
  }
}

// Bus监听函数
const handleDrawPointClicked = (isActive) => {
  startDrawPointFunction.value = isActive;
  if (isActive) {
    startDrawPoint()
  } else {
    stopAllDrawing()
  }
};

const handleDrawPolylineClicked = (isActive) => {
  startDrawPolylineFunction.value = isActive;
  if (isActive) {
    startDrawLine()
  } else {
    stopAllDrawing()
  }
};

const handleDrawPolygonClicked = (isActive) => {
  startDrawPolygonFunction.value = isActive;
  if (isActive) {
    startDrawPolygon()
  } else {
    stopAllDrawing()
    if (map.value) map.value.doubleClickZoom.disable();
  }
};

// 页面挂载完成
onMounted(() => {
  initMap()
  bus.on('draw-point-clicked', handleDrawPointClicked);
  bus.on('draw-polyline-clicked', handleDrawPolylineClicked);
  bus.on('draw-polygon-clicked', handleDrawPolygonClicked);
})

// 组件卸载（优化：严格判空，避免空指针）
onUnmounted(() => {
  // 1. 先解绑所有Bus监听
  bus.off('draw-point-clicked', handleDrawPointClicked);
  bus.off('draw-polyline-clicked', handleDrawPolylineClicked);
  bus.off('draw-polygon-clicked', handleDrawPolygonClicked);

  // 2. 停止绘制（此时DOM可能已销毁，stopAllDrawing内部已做判空）
  stopAllDrawing();

  // 3. 销毁地图实例（严格判空）
  if (map.value) {
    // 先解绑所有地图事件
    map.value.off();
    // 移除所有图层
    map.value.eachLayer(layer => {
      map.value.removeLayer(layer);
    });
    // 销毁地图实例
    map.value.remove();
    // 清空引用（避免内存泄漏）
    map.value = null;
  }

  // 4. 重置所有状态
  pointLngLat.value = [];
  polylineCoordinates.value = [];
  polygonCoordinates.value = [];
  distancelength.value = null;
  calculatePolygonArea.value = null;
  startDrawPointFunction.value = false;
  startDrawPolylineFunction.value = false;
  startDrawPolygonFunction.value = false;

  // 5. 重置事件处理器
  mapEventHandlers.value = {
    pointClick: null,
    lineClick: null,
    lineMousemove: null,
    lineContextmenu: null,
    polygonClick: null,
    polygonMousemove: null,
    polygonDblclick: null
  };

  // 6. 最终恢复鼠标样式（判空）
  const mapDom = getMapDom();
  if (mapDom) {
    mapDom.style.cursor = 'default';
  }
})

</script>

<style>
#map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 0;
}
</style>