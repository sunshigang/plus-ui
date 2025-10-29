<template>
  <div id="map"></div>
</template>

<script setup>
import bus from '../../libs/eventbus'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-editable'
import { ref, onMounted } from 'vue'

const map = ref(null);
const pointLngLat = ref([]);
const polylineCoordinates = ref([])
const polygonCoordinates = ref([])
const distancelength = ref(null);
const calculatePolygonArea = ref(null);
const startDrawPointFunction = ref(false)
const startDrawPolylineFunction = ref(false)
const startDrawPolygonFunction = ref(false)
const initMap = () => {
  if (map.value) return;
  map.value = L.map('map', {
    center: [28.927237, 120.187512],
    zoom: 18,
    maxZoom: 21,
    minZoom: 8,
    // crs: L.CRS.EPSG3857, //设置坐标系4326
    logoControl: false,
    zoomControl: false, //禁用 + - 按钮
    doubleClickZoom: false, // 禁用双击放大
    attributionControl: false, // 移除右下角leaflet标识
    preferCanvas: true, //使用canvas模式渲染矢量图形
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
      maxNativeZoom: 18, // 底图实际支持的最大级别
      maxZoom: 21, // 地图允许的最大缩放级别（高于 maxNativeZoom 时拉伸显示）
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
      maxNativeZoom: 18, // 底图实际支持的最大级别
      maxZoom: 21, // 地图允许的最大缩放级别（高于 maxNativeZoom 时拉伸显示）
    }
  )
  tainditu.addTo(map.value);
  taindituLabel.addTo(map.value);
  map.value.editable = new L.Editable(map.value, {
    position: 'topright', // 编辑工具条位置
    edit: { marker: true } // 启用点编辑支持
  });
  // L.geoJSON(geojsonData, {
  //   style: function (feature) {
  //     return {
  //       color: "blue",
  //       weight: 2,
  //       fillColor: "lightblue",
  //       fillOpacity: 0.5
  //     };
  //   }
  // }).addTo(map.value);


}

// 停止当前所有绘制
const stopAllDrawing = () => {
  if (!map.value) return;
  map.value.eachLayer(layer => {
    const isPointLayer = layer.options?.icon?.options?.title === '点图片';
    const isLineOrPolygonLayer = layer.options?.title === '线' || layer.options?.title === '面';
    if (isPointLayer || isLineOrPolygonLayer) {
      map.value.removeLayer(layer);
    }
  });
  // 重置状态变量
  pointLngLat.value = [];
  polylineCoordinates.value = [];
  polygonCoordinates.value = [];
  distancelength.value = null;
  calculatePolygonArea.value = null;
  document.getElementById('map').style.cursor = 'grab';
  map.value.doubleClickZoom.disable();
};
const startDrawPoint = () => {
  stopAllDrawing();
  let pointIcon = L.icon({
    title: '点图片',
    iconUrl: "/poi.png",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })
  document.getElementById('map').style.cursor = 'crosshair';
  const onClick = (e) => {
    pointLngLat.value = [e.latlng.lng, e.latlng.lat];
    const point = L.marker(e.latlng, {
      draggable: true,
      icon: pointIcon
    }).addTo(map.value);
    point.enableEdit();
    map.value.off({ click: onClick });
    document.getElementById('map').style.cursor = 'grab';
    point.on("dragend", (e) => {
      pointLngLat.value = []
      const newLatLng = e.target.getLatLng();
      pointLngLat.value.push(newLatLng.lng)
      pointLngLat.value.push(newLatLng.lat)
      bus.emit('draw-result', { type: 'point', coordinates: pointLngLat.value, status: startDrawPointFunction.value });
    });
    bus.emit('draw-result', { type: 'point', coordinates: pointLngLat.value, status: startDrawPointFunction.value });
  };
  map.value.on("click", onClick);
};
// 开始绘制线
const startDrawLine = () => {
  stopAllDrawing()
  const polylineOption = {
    title: '线',
    stroke: true,
    color: 'red',
    weight: 2
  };
  const latlngs = [];
  // 绘制线段
  const polyline = L.polyline(latlngs, polylineOption);
  const tempLine = L.polyline([], polylineOption);
  document.getElementById('map').style.cursor = 'crosshair';
  const onClick = e => {
    latlngs.push([e.latlng.lat, e.latlng.lng]);
    polyline.addLatLng(e.latlng);
    polyline.addTo(map.value);
    polylineCoordinates.value = latlngs
    // 计算并更新距离
    distancelength.value = calculateDistance(latlngs);
  };
  map.value.on("click", onClick);
  const onMouseMove = evt => {
    if (latlngs.length > 0) {
      // 添加临时线段
      const coords = [
        latlngs[latlngs.length - 1],
        [evt.latlng.lat, evt.latlng.lng]
      ];
      tempLine.setLatLngs(coords);
      map.value.addLayer(tempLine);
      // 计算并更新临时距离
      const tempLatlngs = [...latlngs, [evt.latlng.lat, evt.latlng.lng]];
      distancelength.value = calculateDistance(tempLatlngs);
    }
  };
  map.value.on("mousemove", onMouseMove);
  // 监听鼠标右键事件以结束绘制
  map.value.on("contextmenu", () => {
    document.getElementById('map').style.cursor = 'grab';
    map.value.removeLayer(tempLine);
    polyline.enableEdit();

    polyline.on('editable:vertex:dragend', function (e) {
      polylineCoordinates.value = []
      // 获取更新后的 Polyline 数据
      const updatedLatLngs = polyline.getLatLngs();
      updatedLatLngs.forEach(e => {
        polylineCoordinates.value.push([e.lat, e.lng])
        distancelength.value = calculateDistance(polylineCoordinates.value);
      });
      bus.emit('draw-result', { type: 'polyline', coordinates: polylineCoordinates.value, length: distancelength.value.toFixed(3), status: startDrawPolylineFunction.value });
    })
    bus.emit('draw-result', { type: 'polyline', coordinates: polylineCoordinates.value, length: distancelength.value.toFixed(3), status: startDrawPolylineFunction.value });
    map.value.off({ click: onClick, mousemove: onMouseMove });
  })
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
  document.getElementById('map').style.cursor = 'crosshair';

  // 1. 定义 dblclick 事件处理函数（单独提取，便于后续解绑）
  const handleDoubleClick = () => {
    document.getElementById('map').style.cursor = 'grab';
    // 修正坐标：只删除最后一个临时点（避免删除过多导致坐标不足3个）
    if (polygonCoordinates.value.length >= 3) {
      const firstPoint = polygonCoordinates.value[0]; // 首坐标
      const lastPoint = polygonCoordinates.value.at(-1); // 尾坐标
      // 若首尾坐标不同，添加首坐标作为尾坐标（实现闭合）
      if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
        polygonCoordinates.value.push(firstPoint);
      }
    }
    map.value.removeLayer(tempLine);
    polygon.enableEdit();

    // 编辑顶点时的逻辑（保持不变）
    polygon.on('editable:vertex:dragend', function (e) {
      polygonCoordinates.value = [];
      const updatedPolygonData = polygon.getLatLngs()[0];
      updatedPolygonData.forEach(e => {
        polygonCoordinates.value.push([e.lat, e.lng]);
      });
      // 移除 Leaflet 自动添加的重复终点（避免面积计算错误）
      if (polygonCoordinates.value.length >= 3) {
        const firstPoint = polygonCoordinates.value[0];
        const lastPoint = polygonCoordinates.value.at(-1);
        // 移除原有可能的重复尾坐标（避免多层闭合）
        if (firstPoint[0] === lastPoint[0] && firstPoint[1] === lastPoint[1]) {
          polygonCoordinates.value.pop();
        }
        // 重新添加首坐标作为尾坐标，确保闭合
        polygonCoordinates.value.push(firstPoint);
      }
      calculatePolygonArea.value = calculateArea(polygonCoordinates.value);
      bus.emit('draw-result', {
        type: 'polygon',
        coordinates: polygonCoordinates.value,
        area: calculatePolygonArea.value.toFixed(3),
        status: startDrawPolygonFunction.value
      });
    });
    console.log("🚀 ~ handleDoubleClick ~ polygonCoordinates.value:", polygonCoordinates.value)
    console.log("🚀 ~ handleDoubleClick ~ calculatePolygonArea.value.toFixed(3):", calculatePolygonArea.value.toFixed(3))
    console.log("🚀 ~ handleDoubleClick ~ startDrawPolygonFunction.value:", startDrawPolygonFunction.value)
    // 回传最终数据
    bus.emit('draw-result', {
      type: 'polygon',
      coordinates: polygonCoordinates.value,
      area: calculatePolygonArea.value.toFixed(3),
      status: startDrawPolygonFunction.value
    });

    // -------------------------- 核心修复：关闭双击相关事件 --------------------------
    // 1. 解绑当前的 dblclick 事件监听器（避免事件残留）
    map.value.off('dblclick', handleDoubleClick);
    // 2. 解绑 click 和 mousemove 事件（原逻辑保留，确保完整清理）
    map.value.off('click', onClick);
    map.value.off('mousemove', onMouseMove);
    // 3. 强制禁用 doubleClickZoom（彻底关闭双击放大功能）
    map.value.doubleClickZoom.disable();
    // -------------------------------------------------------------------------------
  };

  // 点击添加顶点（原逻辑不变）
  const onClick = evt => {
    latlngs.push([evt.latlng.lat, evt.latlng.lng]);
    polygon.addLatLng(evt.latlng);
    if (!map.value.hasLayer(polygon)) {
      polygon.addTo(map.value);
    }
    polygonCoordinates.value = latlngs;
    calculatePolygonArea.value = calculateArea(latlngs);
  };

  // 鼠标移动更新临时线（原逻辑不变）
  const onMouseMove = evt => {
    if (latlngs.length > 0) {
      // -------------------------- 修改：临时线首尾闭合 --------------------------
      const tempPoints = [...latlngs, [evt.latlng.lat, evt.latlng.lng]];
      // 若临时点数量≥2，添加首点作为尾点，让临时线显示为闭合状态
      if (tempPoints.length >= 2) {
        tempPoints.push(tempPoints[0]);
      }
      tempLine.setLatLngs(tempPoints);
      // -------------------------------------------------------------------------------

      if (!map.value.hasLayer(tempLine)) {
        map.value.addLayer(tempLine);
      }
      // 更新多边形的临时坐标（同样确保闭合）
      const tempPolygonPoints = [...latlngs, [evt.latlng.lat, evt.latlng.lng]];
      if (tempPolygonPoints.length >= 2) {
        tempPolygonPoints.push(tempPolygonPoints[0]);
      }
      polygon.setLatLngs(tempPolygonPoints);
      calculatePolygonArea.value = calculateArea(tempPolygonPoints);
    }
  };

  // 2. 绑定 dblclick 事件（使用单独定义的 handleDoubleClick，便于解绑）
  map.value.on('dblclick', handleDoubleClick);
  map.value.on('click', onClick);
  map.value.on('mousemove', onMouseMove);

  // 计算面积函数（原逻辑不变，优化重复坐标判断）
  function calculateArea (latlngs) {
    // 复制数组，避免修改原数据
    const uniqueLatlngs = [...latlngs];
    // 若首尾坐标相同，移除重复的尾坐标（避免面积计算错误）
    if (uniqueLatlngs.length >= 3) {
      const firstPoint = uniqueLatlngs[0];
      const lastPoint = uniqueLatlngs.at(-1);
      if (firstPoint[0] === lastPoint[0] && firstPoint[1] === lastPoint[1]) {
        uniqueLatlngs.pop();
      }
    }
    // 少于3个点，面积为0
    if (uniqueLatlngs.length < 3) {
      return 0;
    }
    // 原有面积计算逻辑（保留不变）
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
// 页面挂载完成的生命周期函数
onMounted(() => {
  initMap()
  // 监听绘制点事件
  bus.on('draw-point-clicked', (isActive) => {
    startDrawPointFunction.value = isActive;
    if (isActive) {
      startDrawPoint()
    } else {
      stopAllDrawing()
    }
  })
  // 监听绘制线事件
  bus.on('draw-polyline-clicked', (isActive) => {
    startDrawPolylineFunction.value = isActive;
    if (isActive) {
      startDrawLine()
    } else {
      stopAllDrawing()
    }
  })
  // 监听绘制面事件
  bus.on('draw-polygon-clicked', (isActive) => {
    startDrawPolygonFunction.value = isActive;
    if (isActive) {
      startDrawPolygon()
    } else {
      stopAllDrawing()
      // 关闭鼠标双击事件
      map.value.doubleClickZoom.disable();
    }
  })
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
