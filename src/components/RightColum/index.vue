<template>
    <div class="rightSidebar" v-show="layerManagementShowHide" v-hasPermi="['screen:function:review']">
        <div class="layerTitle">
            <span class="layerTitleFont">图层管理</span>
        </div>
        <div class="layerContentBody">
            <div class="layerContentA">
                <div class="layerContentTitle">
                    <div class="layerContentLabel">风景区景点</div>
                    <el-checkbox v-model="isAllCheckedA" class="scroll-custom-checkbox"
                        @change="handleAllCheckA"></el-checkbox>
                    <div :class="layerContentStyleA == true ? 'layerContentShow' : 'layerContentHide'"
                        @click="clickLayerContentA"></div>

                </div>
                <transition name="fade">
                    <div v-if="layerContentStyleA" class="contentBodyA">
                        <div class="scrollContentA">
                            <div class="scrollDetailA" v-for="item in checkItemsA" :key="item.id">
                                <div class="scrollDetailFontA">{{ item.name }}</div>
                                <el-checkbox v-model="item.checked" class="scroll-custom-checkbox"
                                    @change="handleCheckChangeA(item)" />
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
            <div class="layerContentA">
                <div class="layerContentTitle">
                    <div class="layerContentLabel">文化资源分布现状</div>
                    <el-checkbox v-model="isAllCheckedB" class="scroll-custom-checkbox"
                        @change="handleAllCheckB"></el-checkbox>
                    <div :class="layerContentStyleB == true ? 'layerContentShow' : 'layerContentHide'"
                        @click="clickLayerContentB"></div>
                </div>
                <transition name="fade">
                    <div v-if="layerContentStyleB" class="contentBodyA">
                        <div class="scrollContentA">
                            <div class="scrollDetailA" v-for="item in checkItemsB" :key="item.id">
                                <div class="scrollDetailFontA">{{ item.name }}</div>
                                <el-checkbox v-model="item.checked" class="scroll-custom-checkbox"
                                    @change="handleCheckChangeB(item)" />
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
            <div class="layerContentA">
                <div class="layerContentTitle">
                    <div class="layerContentLabel">现状交通图</div>
                    <el-checkbox v-model="isAllCheckedC" class="scroll-custom-checkbox"
                        @change="handleAllCheckC"></el-checkbox>
                    <div :class="layerContentStyleC == true ? 'layerContentShow' : 'layerContentHide'"
                        @click="clickLayerContentC"></div>
                </div>
                <transition name="fade">
                    <div v-if="layerContentStyleC" class="contentBodyA">
                        <div class="scrollContentA">
                            <div class="scrollDetailA" v-for="item in checkItemsC" :key="item.id">
                                <div class="scrollDetailFontA">{{ item.name }}</div>
                                <el-checkbox v-model="item.checked" class="scroll-custom-checkbox"
                                    @change="handleCheckChangeC(item)" />
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
            <div class="layerContentA">
                <div class="layerContentTitle">
                    <div class="layerContentLabel">游赏规划</div>
                    <el-checkbox v-model="isAllCheckedD" class="scroll-custom-checkbox"
                        @change="handleAllCheckD"></el-checkbox>
                    <div :class="layerContentStyleD == true ? 'layerContentShow' : 'layerContentHide'"
                        @click="clickLayerContentD"></div>
                </div>
                <transition name="fade">
                    <div v-if="layerContentStyleD" class="contentBodyA">
                        <div class="scrollContentA">
                            <div class="scrollDetailA" v-for="item in checkItemsD" :key="item.id">
                                <div class="scrollDetailFontA">{{ item.name }}</div>
                                <el-checkbox v-model="item.checked" class="scroll-custom-checkbox"
                                    @change="handleCheckChangeD(item)" />
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
            <div class="layerContentA">
                <div class="layerContentTitle">
                    <div class="layerContentLabel">主要景观游赏线</div>
                    <el-checkbox v-model="isAllCheckedE" class="scroll-custom-checkbox"
                        @change="handleAllCheckE"></el-checkbox>
                    <div :class="layerContentStyleE == true ? 'layerContentShow' : 'layerContentHide'"
                        @click="clickLayerContentE"></div>
                </div>
                <transition name="fade">
                    <div v-if="layerContentStyleE" class="contentBodyA">
                        <div class="scrollContentA">
                            <div class="scrollDetailA" v-for="item in checkItemsE" :key="item.id">
                                <div class="scrollDetailFontA">{{ item.name }}</div>
                                <el-checkbox v-model="item.checked" class="scroll-custom-checkbox"
                                    @change="handleCheckChangeE(item)" />
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
            <div class="layerContentA">
                <div class="layerContentTitle">
                    <div class="layerContentLabel">生态保护红线</div>
                    <el-checkbox v-model="isAllCheckedJ" class="scroll-custom-checkbox"
                        @change="handleAllCheckJ"></el-checkbox>
                    <div :class="layerContentStyleJ == true ? 'layerContentShow' : 'layerContentHide'"
                        @click="clickLayerContentJ"></div>
                </div>
                <transition name="fade">
                    <div v-if="layerContentStyleJ" class="contentBodyA">
                        <div class="scrollContentA">
                            <div class="scrollDetailA" v-for="item in checkItemsJ" :key="item.id">
                                <div class="scrollDetailFontA">{{ item.name }}</div>
                                <el-checkbox v-model="item.checked" class="scroll-custom-checkbox"
                                    @change="handleCheckChangeJ(item)" />
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
            <div class="layerContentA">
                <div class="layerContentTitle">
                    <div class="layerContentLabel">分级保护规划</div>
                    <el-checkbox v-model="isAllCheckedI" class="scroll-custom-checkbox"
                        @change="handleAllCheckI"></el-checkbox>
                    <div :class="layerContentStyleI == true ? 'layerContentShow' : 'layerContentHide'"
                        @click="clickLayerContentI"></div>
                </div>
                <transition name="fade">
                    <div v-if="layerContentStyleI" class="contentBodyA">
                        <div class="scrollContentA">
                            <div class="scrollDetailA" v-for="item in checkItemsI" :key="item.id">
                                <div class="scrollDetailFontA">{{ item.name }}</div>
                                <el-checkbox v-model="item.checked" class="scroll-custom-checkbox"
                                    @change="handleCheckChangeI(item)" />
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
            <div class="layerContentA">
                <div class="layerContentTitle">
                    <div class="layerContentLabel">景区范围</div>
                    <el-checkbox v-model="isAllCheckedK" class="scroll-custom-checkbox"
                        @change="handleAllCheckK"></el-checkbox>
                    <div :class="layerContentStyleK == true ? 'layerContentShow' : 'layerContentHide'"
                        @click="clickLayerContentK"></div>
                </div>
                <transition name="fade">
                    <div v-if="layerContentStyleK" class="contentBodyA">
                        <div class="scrollContentA">
                            <div class="scrollDetailA" v-for="item in checkItemsK" :key="item.id">
                                <div class="scrollDetailFontA">{{ item.name }}</div>
                                <el-checkbox v-model="item.checked" class="scroll-custom-checkbox"
                                    @change="handleCheckChangeK(item)" />
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
            <div class="layerContentA">
                <div class="layerContentTitle">
                    <div class="layerContentLabel">土地利用现状</div>
                    <el-checkbox v-model="isAllCheckedF" class="scroll-custom-checkbox"
                        @change="handleAllCheckF"></el-checkbox>
                    <div :class="layerContentStyleF == true ? 'layerContentShow' : 'layerContentHide'"
                        @click="clickLayerContentF"></div>
                </div>
                <transition name="fade">
                    <div v-if="layerContentStyleF" class="contentBodyA">
                        <div class="scrollContentA">
                            <div class="scrollDetailA" v-for="item in checkItemsF" :key="item.id">
                                <div class="scrollDetailFontA">{{ item.label }}</div>
                                <el-checkbox v-model="item.checked" class="scroll-custom-checkbox"
                                    @change="handleCheckChangeF(item)" />
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
            <div class="layerContentA">
                <div class="layerContentTitle">
                    <div class="layerContentLabel">游赏结构规划图</div>
                    <el-checkbox v-model="isAllCheckedG" class="scroll-custom-checkbox"
                        @change="handleAllCheckG"></el-checkbox>
                    <div :class="layerContentStyleG == true ? 'layerContentShow' : 'layerContentHide'"
                        @click="clickLayerContentG"></div>
                </div>
                <transition name="fade">
                    <div v-if="layerContentStyleG" class="contentBodyA">
                        <div class="scrollContentA">
                            <div class="scrollDetailA" v-for="item in checkItemsG" :key="item.id">
                                <div class="scrollDetailFontA">{{ item.name }}</div>
                                <el-checkbox v-model="item.checked" class="scroll-custom-checkbox"
                                    @change="handleCheckChangeG(item)" />
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
            <div class="layerContentA">
                <div class="layerContentTitle">
                    <div class="layerContentLabel">景区划分规划</div>
                    <el-checkbox v-model="isAllCheckedH" class="scroll-custom-checkbox"
                        @change="handleAllCheckH"></el-checkbox>
                    <div :class="layerContentStyleH == true ? 'layerContentShow' : 'layerContentHide'"
                        @click="clickLayerContentH"></div>
                </div>
                <transition name="fade">
                    <div v-if="layerContentStyleH" class="contentBodyA">
                        <div class="scrollContentA">
                            <div class="scrollDetailA" v-for="item in checkItemsH" :key="item.id">
                                <div class="scrollDetailFontA">{{ item.name }}</div>
                                <el-checkbox v-model="item.checked" class="scroll-custom-checkbox"
                                    @change="handleCheckChangeH(item)" />
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
            <div class="layerContentA">
                <div class="layerContentTitle">
                    <div class="layerContentLabel">备注信息</div>
                    <el-checkbox v-model="isAllCheckedRemark" class="scroll-custom-checkbox"
                        @change="handleAllCheckRemark"></el-checkbox>
                    <div :class="layerContentStyleRemark == true ? 'layerContentShow' : 'layerContentHide'"
                        @click="clickLayerContentRemark"></div>
                </div>
                <transition name="fade">
                    <div v-if="layerContentStyleRemark" class="contentBodyA">
                        <div class="scrollContentA">
                            <div class="scrollDetailA" v-for="item in checkItemsRemark" :key="item.id">
                                <div class="scrollDetailFontA">{{ item.type }}：{{ item.layerName }}</div>
                                <el-checkbox v-model="item.checked" class="scroll-custom-checkbox"
                                    @change="handleCheckChangeRemark(item)" />
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
    </div>
    <div class="functionPanel" v-show="functionPanelShowHide" v-hasPermi="['screen:function:review']">
        <!-- 箭头部分：根据当前选中的按钮动态调整位置（若多个选中，默认优先显示最后一个选中的） -->
        <div class="arrow" :style="arrowStyle"></div>

        <!-- 文字区域：点击切换自身选中状态 -->
        <div class="text-container">
            <div class="text-item" @click="selectItem(0)" :class="{ active: isSelected[0] }"
                v-hasPermi="['screen:function:redline']">
                红线叠加对比
            </div>
            <div class="text-item" @click="selectItem(1)" :class="{ active: isSelected[1] }"
                v-hasPermi="['screen:function:splitscreen']">
                分屏比对
            </div>
            <div class="text-item" @click="selectItem(2)" :class="{ active: isSelected[2] }"
                v-hasPermi="['screen:function:analysis']">
                时空分析
            </div>
        </div>

        <!-- 圆圈区域：根据按钮选中状态动态切换实心/空心（与文字按钮对应） -->
        <div class="circle-container">
            <div class="circle" :class="{ solid: isSelected[0] }" v-hasPermi="['screen:function:redline']"></div>
            <!-- 对应“红线叠加对比” -->
            <div class="circle" :class="{ solid: isSelected[1] }" v-hasPermi="['screen:function:splitscreen']"></div>
            <!-- 对应“分屏比对” -->
            <div class="circle" :class="{ solid: isSelected[2] }" v-hasPermi="['screen:function:analysis']"></div>
            <!-- 对应“时空分析” -->
            <!-- 移除原有的固定实心圆圈，改为与按钮状态联动 -->
        </div>
    </div>
    <div class="drawFunctionBody" v-if="drawFunctionShowHide" v-hasPermi="['screen:function:vector']">
        <div :class="drawPointBodyStyle == true ? 'drawPointBodySelected' : 'drawPointBodySelect'"
            @click="clickDrawPoint" v-hasPermi="['screen:function:point']">
            <div class="drawPointImg"></div>
            <div class="drawPointFont">点</div>
        </div>
        <div :class="drawPloylineBodyStyle == true ? 'drawPloylineBodySelected' : 'drawPloylineBodySelect'"
            @click="clickDrawPloyline" v-hasPermi="['screen:function:polyline']">
            <div class="drawPolylineImg"></div>
            <div class="drawPolylineFont">线</div>
        </div>
        <div :class="drawPloygonBodyStyle == true ? 'drawPloygonBodySelected' : 'drawPloygonBodySelect'"
            @click="clickDrawPloygon" v-hasPermi="['screen:function:polygon']">
            <div class="drawPloygonImg"></div>
            <div class="drawPloygonFont">面</div>
        </div>
    </div>
</template>

<script setup>
import { toRefs, reactive, ref, onMounted, computed, watch } from 'vue'
import bus from '../../libs/eventbus'
import { getMarkList } from "./remark.js";
const isAllCheckedA = ref(false);
const isAllCheckedB = ref(false);
const isAllCheckedC = ref(false);
const isAllCheckedD = ref(false);
const isAllCheckedE = ref(false);
const isAllCheckedF = ref(false);
const isAllCheckedG = ref(false);
const isAllCheckedH = ref(false);
const isAllCheckedI = ref(false);
const isAllCheckedJ = ref(false);
const isAllCheckedK = ref(false);
const isAllCheckedRemark = ref(false);
const handleAllCheckA = (isChecked) => {
    checkItemsA.value.forEach(item => {
        item.checked = isChecked;
        handleCheckChangeA(item);
    });
};
const handleAllCheckB = (isChecked) => {
    checkItemsB.value.forEach(item => {
        item.checked = isChecked;
        handleCheckChangeB(item);
    });
};
const handleAllCheckC = (isChecked) => {
    checkItemsC.value.forEach(item => {
        item.checked = isChecked;
        handleCheckChangeC(item);
    });
};
const handleAllCheckD = (isChecked) => {
    checkItemsD.value.forEach(item => {
        item.checked = isChecked;
        handleCheckChangeD(item);
    });
};
const handleAllCheckE = (isChecked) => {
    checkItemsE.value.forEach(item => {
        item.checked = isChecked;
        handleCheckChangeE(item);
    });
};
const handleAllCheckF = (isChecked) => {
    checkItemsF.value.forEach(item => {
        item.checked = isChecked;
        handleCheckChangeF(item);
    });
};
const handleAllCheckG = (isChecked) => {
    checkItemsG.value.forEach(item => {
        item.checked = isChecked;
        handleCheckChangeG(item);
    });
};
const handleAllCheckH = (isChecked) => {
    checkItemsH.value.forEach(item => {
        item.checked = isChecked;
        handleCheckChangeH(item);
    });
};
const handleAllCheckI = (isChecked) => {
    checkItemsI.value.forEach(item => {
        item.checked = isChecked;
        handleCheckChangeI(item);
    });
};
const handleAllCheckJ = (isChecked) => {
    checkItemsJ.value.forEach(item => {
        item.checked = isChecked;
        handleCheckChangeJ(item);
    });
};
const handleAllCheckK = (isChecked) => {
    checkItemsK.value.forEach(item => {
        item.checked = isChecked;
        handleCheckChangeK(item);
    });
};
const handleAllCheckRemark = (isChecked) => {
    checkItemsRemark.value.forEach(item => {
        item.checked = isChecked;
        handleCheckChangeRemark(item);
    });
};

const checkItemsA = ref([
    { id: 1, name: '一级人文景源', relicType: '自然风景', checked: false },
    { id: 2, name: '二级人文景源', relicType: '人文景观', checked: false },
    { id: 3, name: '三级人文景源', relicType: '古迹保护', checked: false },
    { id: 4, name: '一级自然景源', relicType: '自然风景', checked: false },
    { id: 5, name: '二级自然景源', relicType: '人文景观', checked: false },
    { id: 6, name: '三级自然景源', relicType: '古迹保护', checked: false },
    { id: 7, name: '行政村', relicType: '行政村', checked: false },
    { id: 8, name: '停车场', relicType: '停车场', checked: false },
])
const checkItemsB = ref([
    { id: 1, name: '岩洞寺庙文化景源', checked: false },
    { id: 2, name: '胡公文化景源', checked: false },
    { id: 3, name: '书院文化景源', checked: false },
    { id: 4, name: '抗战历史文化景源', checked: false },
])
const checkItemsC = ref([
    { id: 1, name: '对外交通', checked: false },
    { id: 2, name: '机动车道', checked: false },
])
const checkItemsD = ref([
    { id: 1, name: '一级车行道', checked: false },
    { id: 2, name: '一级游步道', checked: false },
    { id: 3, name: '二级游步道', checked: false },
    { id: 4, name: '客运索道', checked: false },
])
const checkItemsE = ref([{ id: 1, name: '主要景观游赏线', checked: false },])
const checkItemsF = ref([
    { id: 1, label: '风景游赏用地', name: '土地利用现状-甲类', checked: false },
    { id: 2, label: '旅游服务设施用地', name: '土地利用现状-乙类', checked: false },
    { id: 3, label: '居民社会用地', name: '土地利用现状-丙类', checked: false },
    { id: 4, label: '交通与功能用地', name: '土地利用现状-丁类', checked: false },
    { id: 5, label: '林地', name: '土地利用现状-戊类', checked: false },
    { id: 6, label: '园地', name: '土地利用现状-己类', checked: false },
    { id: 7, label: '耕地', name: '土地利用现状-庚类', checked: false },
    { id: 8, label: '草地', name: '土地利用现状-辛类', checked: false },
    { id: 9, label: '水域', name: '土地利用现状-壬类', checked: false },
])
const checkItemsG = ref([
    { id: 1, name: '景群', checked: false },
    { id: 2, name: '景区分区', checked: false },
])
const checkItemsH = ref([
    { id: 1, name: '灵岩山湖景区', checked: false },
    { id: 2, name: '方山山林景区', checked: false },
    { id: 3, name: '方岩丹霞景区', checked: false },
])
const checkItemsI = ref([
    { id: 1, name: '一级保护区', checked: false },
    { id: 2, name: '二级保护区', checked: false },
    { id: 3, name: '三级保护区', checked: false },
])
const checkItemsJ = ref([
    { id: 1, name: '生态保护红线', checked: false },
])
const checkItemsK = ref([
    { id: 1, name: '方岩风景名胜区范围_16版', checked: false },
    { id: 2, name: '方岩风景名胜区总体规划范围', checked: false },
])
const checkItemsRemark = ref([
    // { id: 1, name: '方岩风景区总体规划范围', checked: false },
    // { id: 2, name: '方岩风景区划范围_16版', checked: false },
    // { id: 3, name: '在编方岩风景名胜区范围', checked: false },
])
const allCheckItems = ref([
    checkItemsA,
    checkItemsB,
    checkItemsC,
    checkItemsD,
    checkItemsE,
    checkItemsF,
    checkItemsG,
    checkItemsH,
    checkItemsI,
    checkItemsJ,
    checkItemsK,
])
const layerManagementShowHide = ref(false)
const functionPanelShowHide = ref(false)
const layerContentStyleA = ref(true)
const layerContentStyleB = ref(false)
const layerContentStyleC = ref(false)
const layerContentStyleD = ref(false)
const layerContentStyleE = ref(false)
const layerContentStyleF = ref(false)
const layerContentStyleG = ref(false)
const layerContentStyleH = ref(false)
const layerContentStyleI = ref(false)
const layerContentStyleJ = ref(false)
const layerContentStyleK = ref(false)
const layerContentStyleRemark = ref(false)
const drawFunctionShowHide = ref(false)
const drawPloygonBodyStyle = ref(false) // 面功能选中状态
const drawPloylineBodyStyle = ref(false) // 线功能选中状态
const drawPointBodyStyle = ref(false) // 点功能选中状态
const clickDrawPloygon = () => {
    // 切换面功能选中状态
    drawPloygonBodyStyle.value = !drawPloygonBodyStyle.value
    // 关闭其他绘制状态
    if (drawPloygonBodyStyle.value) {
        drawPointBodyStyle.value = false
        drawPloylineBodyStyle.value = false
    }
    bus.emit('draw-polygon-clicked', drawPloygonBodyStyle.value)
}
const clickDrawPloyline = () => {
    // 切换线功能选中状态
    drawPloylineBodyStyle.value = !drawPloylineBodyStyle.value
    if (drawPloylineBodyStyle.value) {
        drawPointBodyStyle.value = false
        drawPloygonBodyStyle.value = false
    }
    bus.emit('draw-polyline-clicked', drawPloylineBodyStyle.value)
}
const clickDrawPoint = () => {
    // 切换点功能选中状态
    drawPointBodyStyle.value = !drawPointBodyStyle.value
    if (drawPointBodyStyle.value) {
        drawPloylineBodyStyle.value = false
        drawPloygonBodyStyle.value = false
    }
    bus.emit('draw-point-clicked', drawPointBodyStyle.value)
}
const handleCheckChangeCommon = (item, layerType) => {
    console.log(`Item ${item.id} (${layerType}) checked: ${item.checked}`);
    bus.emit('layerCheckMessage', {
        id: item.id,
        name: item.name,        // 对应 UE 命令的 Tag
        checked: item.checked,  // 显示/隐藏状态
        layerType: layerType    // 图层类型：line/area
    });
};

const handleCheckChangeA = item => {
    // 处理复选框状态变化
    console.log(`Item ${item.id} checked: ${item.checked}`)
    bus.emit('attractionTypeMessage', item)
}
const handleCheckChangeB = item => {
    // 处理复选框状态变化
    console.log(`Item ${item.id} checked: ${item.checked}`)
    bus.emit('cultureTypeMessage', item)
}
const handleCheckChangeC = (item) => handleCheckChangeCommon(item, 'Line');
const handleCheckChangeD = (item) => handleCheckChangeCommon(item, 'Line');
const handleCheckChangeE = (item) => handleCheckChangeCommon(item, 'Line');
const handleCheckChangeF = (item) => handleCheckChangeCommon(item, 'Area');
const handleCheckChangeG = (item) => handleCheckChangeCommon(item, 'Area');
const handleCheckChangeH = (item) => handleCheckChangeCommon(item, 'Area');
const handleCheckChangeI = (item) => handleCheckChangeCommon(item, 'Area');
const handleCheckChangeJ = (item) => handleCheckChangeCommon(item, 'Area');
const handleCheckChangeK = (item) => handleCheckChangeCommon(item, 'Area');
const handleCheckChangeRemark = item => {
    // 处理复选框状态变化
    console.log(`Item ${item.id} checked: ${item.checked}`)
    bus.emit('remarkMessage', item)
}
const clickLayerContentA = () => {
    layerContentStyleA.value = !layerContentStyleA.value
}
const clickLayerContentB = () => {
    layerContentStyleB.value = !layerContentStyleB.value
}
const clickLayerContentC = () => {
    layerContentStyleC.value = !layerContentStyleC.value
}
const clickLayerContentD = () => {
    layerContentStyleD.value = !layerContentStyleD.value
}
const clickLayerContentE = () => {
    layerContentStyleE.value = !layerContentStyleE.value
}
const clickLayerContentF = () => {
    layerContentStyleF.value = !layerContentStyleF.value
}
const clickLayerContentG = () => {
    layerContentStyleG.value = !layerContentStyleG.value
}
const clickLayerContentH = () => {
    layerContentStyleH.value = !layerContentStyleH.value
}
const clickLayerContentI = () => {
    layerContentStyleI.value = !layerContentStyleI.value
}
const clickLayerContentJ = () => {
    layerContentStyleJ.value = !layerContentStyleJ.value
}
const clickLayerContentK = () => {
    layerContentStyleK.value = !layerContentStyleK.value
}
const clickLayerContentRemark = () => {
    layerContentStyleRemark.value = !layerContentStyleRemark.value
}
const setOnlyEcoRedlineChecked = (isChecked) => {
    checkItemsJ.value.forEach((item) => {
        item.checked = isChecked;
        handleCheckChangeJ(item);
    });
    // 核心同步：生态保护红线的全选框、子项、数据框状态完全一致
    isAllCheckedJ.value = isChecked; // 全选框勾选/取消
    layerContentStyleJ.value = isChecked; // 数据框展开/折叠（true=展开，false=折叠）

    // 其他分类状态重置
    [isAllCheckedA, isAllCheckedB, isAllCheckedC, isAllCheckedD, isAllCheckedE,
        isAllCheckedF, isAllCheckedG, isAllCheckedH, isAllCheckedI, isAllCheckedK].forEach(checkedRef => {
            checkedRef.value = false;
        });
    [layerContentStyleA, layerContentStyleB, layerContentStyleC, layerContentStyleD, layerContentStyleE,
        layerContentStyleF, layerContentStyleG, layerContentStyleH, layerContentStyleI, layerContentStyleK].forEach(styleRef => {
            styleRef.value = false;
        });

    // 备注信息图层隐藏
    checkItemsRemark.value.forEach(item => item.checked = false);
    isAllCheckedRemark.value = false;
    layerContentStyleRemark.value = false;
};
// 1. 修复：用对象存储每个按钮的独立选中状态（默认全未选中）
const isSelected = ref({
    0: false, // 0: 红线叠加对比
    1: false, // 1: 分屏比对
    2: false  // 2: 时空分析
})

// 2. 修复：点击按钮切换自身选中状态（不影响其他按钮）
const selectItem = (index) => {
    // 切换当前按钮的选中状态（true ↔ false）
    isSelected.value[index] = !isSelected.value[index]
    // 关键联动：仅当点击“红线叠加对比”（索引0）时，同步图层状态
    if (index === 0) {
        layerManagementShowHide.value = true
        // 按钮选中 → 图层全选；按钮未选中 → 图层取消全选
        setOnlyEcoRedlineChecked(isSelected.value[index]);
    } else if (index === 1) {
        layerManagementShowHide.value = false
    } else {
        layerManagementShowHide.value = true
    }
    // 通知其他组件：传递“按钮索引”和“当前选中状态”（便于后续业务逻辑扩展）
    bus.emit('function-panel-clicked', { index, isSelected: isSelected.value[index] })
}

// 3. 修复：箭头位置逻辑（若多个按钮选中，默认指向最后一个选中的按钮；无选中时隐藏或默认位置）
const arrowStyle = computed(() => {
    // 定义每个按钮对应的箭头 top 值（与原逻辑一致）
    const topValues = [
        '2px',  // 0: 红线叠加对比
        '43px',  // 1: 分屏比对
        '83px'   // 2: 时空分析
    ]

    // 找到最后一个被选中的按钮索引（优先级：2 → 1 → 0）
    let lastSelectedIndex = -1
    for (let i = 2; i >= 0; i--) {
        if (isSelected.value[i]) {
            lastSelectedIndex = i
            break
        }
    }
    return {
        // 有选中按钮：箭头指向最后一个选中的；无选中：箭头隐藏（或设为默认位置）
        top: lastSelectedIndex > -1 ? topValues[lastSelectedIndex] : '2px',
        display: lastSelectedIndex > -1 ? 'block' : 'none', // 无选中时隐藏箭头
        transition: 'top 0.3s ease, display 0.3s ease'
    }
})

watch(
    () => checkItemsA.value.map(item => item.checked),
    (checkedList) => {
        // 所有子项都选中时，全选框勾选；否则取消
        isAllCheckedA.value = checkedList.every(checked => checked);
    },
    { deep: true } // 深度监听数组内元素变化
);
watch(
    () => checkItemsB.value.map(item => item.checked),
    (checkedList) => {
        isAllCheckedB.value = checkedList.every(checked => checked);
    },
    { deep: true }
);

// 监听 C 分类子项变化
watch(
    () => checkItemsC.value.map(item => item.checked),
    (checkedList) => {
        isAllCheckedC.value = checkedList.every(checked => checked);
    },
    { deep: true }
);

// 监听 D 分类子项变化
watch(
    () => checkItemsD.value.map(item => item.checked),
    (checkedList) => {
        isAllCheckedD.value = checkedList.every(checked => checked);
    },
    { deep: true }
);

// 监听 E 分类子项变化
watch(
    () => checkItemsE.value.map(item => item.checked),
    (checkedList) => {
        isAllCheckedE.value = checkedList.every(checked => checked);
    },
    { deep: true }
);

// 监听 F 分类子项变化
watch(
    () => checkItemsF.value.map(item => item.checked),
    (checkedList) => {
        isAllCheckedF.value = checkedList.every(checked => checked);
    },
    { deep: true }
);

// 监听 G 分类子项变化
watch(
    () => checkItemsG.value.map(item => item.checked),
    (checkedList) => {
        isAllCheckedG.value = checkedList.every(checked => checked);
    },
    { deep: true }
);

// 监听 H 分类子项变化
watch(
    () => checkItemsH.value.map(item => item.checked),
    (checkedList) => {
        isAllCheckedH.value = checkedList.every(checked => checked);
    },
    { deep: true }
);

// 监听 I 分类子项变化
watch(
    () => checkItemsI.value.map(item => item.checked),
    (checkedList) => {
        isAllCheckedI.value = checkedList.every(checked => checked);
    },
    { deep: true }
);

// 监听 J 分类子项变化
// watch(
//     () => checkItemsJ.value.map(item => item.checked),
//     (checkedList) => {
//         isAllCheckedJ.value = checkedList.every(checked => checked);
//     },
//     { deep: true }
// );
watch(
    () => checkItemsJ.value[0]?.checked, // 监听唯一子项的checked状态
    (isChecked) => {
        if (isChecked !== undefined) {
            isSelected.value[0] = isChecked; // 子项勾选 → 按钮激活；子项取消 → 按钮取消
        }
    },
    { deep: true }
);

// 监听 K 分类子项变化
watch(
    () => checkItemsK.value.map(item => item.checked),
    (checkedList) => {
        isAllCheckedK.value = checkedList.every(checked => checked);
    },
    { deep: true }
);
watch(
    () => checkItemsRemark.value.map(item => item.checked),
    (checkedList) => {
        // 所有备注子项都选中时，全选框勾选；否则取消
        isAllCheckedRemark.value = checkedList.every(checked => checked);
    },
    { deep: true } // 深度监听数组内元素变化
);

onMounted(() => {
    setOnlyEcoRedlineChecked(isSelected.value[0]);
    isAllCheckedRemark.value = false;
    bus.on('scheme-review-clicked', data => {
        console.log('方案审查可见性:', data)
        layerManagementShowHide.value = data
        functionPanelShowHide.value = data
        // drawFunctionShowHide.value = !data
        if (!data) {
            drawFunctionShowHide.value = data
        } else {
            drawFunctionShowHide.value = false
        }
        getMarkList().then((res) => {
            checkItemsRemark.value = res.rows
            if (isSelected.value[0]) {
                checkItemsRemark.value.forEach(item => item.checked = true);
                isAllCheckedRemark.value = true;
            }
        }).catch((error) => {
            console.error('获取标注信息失败', error);
        });
    })
    bus.on('planning-achievement-clicked', data => {
        layerManagementShowHide.value = data
        functionPanelShowHide.value = false
    })
    bus.on('vector-layer-clicked', isVisible => {
        drawFunctionShowHide.value = isVisible
        if (isVisible == false) {
            layerManagementShowHide.value = false
            functionPanelShowHide.value = false
        } else {
            layerManagementShowHide.value = false
            functionPanelShowHide.value = false
        }
    })


})
</script>

<style lang="scss" scoped>
.rightSidebar {
    pointer-events: auto;
    position: absolute;
    width: 312px;
    height: 488px;
    top: 14.26%;
    right: 6%;
    z-index: 2;
    background: url(../../static/image/right/layer-bg.png) no-repeat;
    background-size: 100% 100%;

    .layerTitle {
        margin-left: 34px;
        margin-top: 31px;
        width: 246px;
        height: 36px;
        background: url(../../static/image/right/layer-title.png) no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-content: center;

        .layerTitleFont {
            width: 92px;
            height: 32px;
            font-family: 'xianglifang';
            font-weight: 400;
            font-size: 24px;
            color: #ffffff;
            line-height: 36px;
            text-shadow: 2px 0px 6px #0e0f19;
            text-align: center;
            letter-spacing: 3px;
        }
    }

    .layerContentBody {
        width: 95%;
        height: 410px;
        display: flex;
        flex-direction: column;
        overflow-y: auto; // 核心：超出高度时显示垂直滚动条
        padding: 0 5px; // 可选：左右留小间距，避免滚动条与内容贴边

        &::-webkit-scrollbar {
            width: 6px; // 滚动条宽度
        }

        &::-webkit-scrollbar-thumb {
            background-color: rgba(255, 207, 112, 0.01); // 滚动条滑块颜色（与文字渐变呼应）
            border-radius: 3px; // 滚动条圆角
        }

        &::-webkit-scrollbar-track {
            background-color: transparent; // 滚动条轨道透明
        }

        .layerContentA {
            margin-top: 10px;

            .layerContentTitle {
                position: relative;
                display: flex;
                flex-direction: row;
                justify-content: space-between; // 保留左右布局，用于图标定位
                align-items: center; // 确保内部元素垂直居中
                width: 85%;
                height: 34px;
                margin-left: 18px;

                .scroll-custom-checkbox {
                    position: absolute;
                    right: 35px; 
                    top: 50%; // 垂直居中第一步：顶部对齐50%
                    transform: translateY(-50%); // 垂直居中第二步：向上偏移自身50%，实现完全居中
                    margin: 0; // 清除原有margin，避免干扰
                    z-index: 1; // 确保在文字上方，不被遮挡

                    :deep(.el-checkbox__inner) {
                        width: 17px;
                        height: 17px;
                        background-color: transparent;
                        border: 2px solid #76602f;
                    }

                    :deep(.el-checkbox__inner::after) {
                        width: 6px;
                        height: 8px;
                        border: 3px solid #89df4a;
                        border-left: 0;
                        border-top: 0;
                    }
                }

                .layerContentLabel {
                    margin-left: 15px;
                    font-family: 'SourceHanSansCN-Medium';
                    font-weight: 500;
                    font-size: 18px;
                    color: #ece1b9;
                    line-height: 36px;
                    text-shadow: 2px 1px 8px #ffed59;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                    background: linear-gradient(to bottom, #ffffff, #ffcf70);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }

                .layerContentShow {
                    cursor: pointer;
                    width: 22px;
                    height: 28px;
                    background: url(../../static/image/right/down.png) no-repeat;
                    background-size: 100% 100%;
                }

                .layerContentHide {
                    cursor: pointer;
                    width: 28.1px;
                    height: 22px;
                    background: url(../../static/image/right/left.png) no-repeat;
                    background-size: 100% 100%;
                }
            }

            .contentBodyA {
                overflow: hidden;
                /* 确保内容不超过父盒子 */
            }

            .scrollContentA {
                width: 77%;
                max-height: 110px;
                /* 设置最大高度 */
                overflow-y: auto;

                &::-webkit-scrollbar {
                    width: 6px; // 滚动条宽度
                }

                &::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 207, 112, 0.01); // 滚动条滑块颜色（与文字渐变呼应）
                    border-radius: 3px; // 滚动条圆角
                }

                &::-webkit-scrollbar-track {
                    background-color: transparent; // 滚动条轨道透明
                }

                /* 允许上下滚动 */
                font-family: 'SourceHanSansCN-Medium';
                font-weight: 400;
                font-size: 15px;
                color: #ffffff;
                line-height: 36px;
                display: flex;
                flex-direction: column;
                margin-left: 40px;

                // background-color: red;
                .scrollDetailA {
                    width: 100%;
                    height: 30px;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;

                    .scrollDetailFontA {
                        margin-left: 5px;
                    }

                    .scroll-custom-checkbox {
                        margin-top: 5px;

                        :deep(.el-checkbox__inner) {
                            width: 17px;
                            height: 17px;
                            background-color: transparent;
                            border: 2px solid #76602f;
                        }

                        :deep(.el-checkbox__inner::after) {
                            width: 6px;
                            height: 8px;
                            border: 3px solid #89df4a;
                            border-left: 0;
                            border-top: 0;
                        }
                    }
                }
            }
        }
    }
}

.functionPanel {
    pointer-events: auto;
    position: absolute;
    width: 220px;
    height: 113px;
    top: 82.04%;
    right: 6.25%;
    z-index: 2;
    // background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: row;
    align-items: center;
    /* 垂直居中对齐 */

    /* 第一部分：箭头 */
    .arrow {
        width: 42px;
        height: 44px;
        background: url(../../static/image/right/arrow.png) no-repeat;
        background-size: 100% 100%;
        position: absolute;
        /* 绝对定位以便动态调整位置 */
        left: 0;
        /* 固定在左侧 */
        transition: top 0.3s ease;
        /* 平滑过渡动画 */
    }

    /* 第二部分：文字容器 */
    .text-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-right: 20px;
        margin-left: 40px;
        /* 给箭头留出位置 */

        .text-item {
            width: 147px;
            height: 28px;
            font-family: 'xianglifang';
            font-weight: 400;
            font-size: 24px;
            /* 默认字体大小 */
            color: #f5e4c4;
            text-align: right;
            font-style: italic;
            text-decoration-line: underline;
            text-transform: none;
            line-height: 28px;
            margin-bottom: 15px;
            cursor: pointer;
            transition: font-size 0.3s ease;
            &.active {
                font-size: 30px;
                color: #ffa621;
                /* 可选：选中时变色 */
            }
        }

        .text-item:last-child {
            margin-bottom: 0;
        }
    }

    .circle-container {
        display: flex;
        flex-direction: column;
        justify-content: center;

        .circle {
            width: 9px;
            height: 9px;
            border: 1px solid #ffa621;
            border-radius: 50%;
            margin-bottom: 12px;
            background-color: transparent;
            transition: background-color 0.3s ease, border 0.3s ease;
            margin-top: 20px;
        }

        /* 仅当按钮选中时，圆圈变为实心（与文字按钮的 active 状态同步） */
        .circle.solid {
            background-color: #ffa621;
            border: none; // 实心时移除边框
            width: 10px;
            height: 10px;
        }

        /* 移除原有的固定 .solid 类圆圈 */
    }
}

.drawFunctionBody {
    pointer-events: auto;
    position: absolute;
    width: 71px;
    height: 295px;
    top: 62.28%;
    right: 5.25%;
    z-index: 2;
    display: flex;
    flex-direction: column;

    /* 1. 点模块：选中/未选中样式 */
    .drawPointBodySelect,
    .drawPointBodySelected {
        cursor: pointer;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .drawPointImg {
            width: 56px;
            height: 56px;
            background-size: 100% 100%;
        }

        .drawPointFont {
            font-family: 'xianglifang';
            font-weight: 400;
            font-size: 24px;
            margin-top: 5px;
            /* 统一：图标到文字的间距 */
            width: 71px;
            /* 统一：文字容器宽度（与选中状态背景图一致） */
            height: 20px;
            /* 关键统一：文字容器高度（与选中状态背景图高度一致） */
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    /* 点-未选中 */
    .drawPointBodySelect .drawPointImg {
        background: url(../../static/image/right/draw-select.png) no-repeat;
        background-size: 100% 100%;
    }

    .drawPointBodySelect .drawPointFont {
        color: #35803b;
    }

    /* 点-选中 */
    .drawPointBodySelected .drawPointImg {
        background: url(../../static/image/right/draw-selected.png) no-repeat;
        background-size: 100% 100%;
    }

    .drawPointBodySelected .drawPointFont {
        color: #f3dfa9;
        background: url(../../static/image/right/font-selected.png) no-repeat;
        background-size: 100% 100%;
    }

    /* 2. 线模块：选中/未选中样式（与点模块逻辑完全一致） */
    .drawPloylineBodySelect,
    .drawPloylineBodySelected {
        cursor: pointer;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .drawPolylineImg {
            width: 56px;
            height: 56px;
            background-size: 100% 100%;
        }

        .drawPolylineFont {
            font-family: 'xianglifang';
            font-weight: 400;
            font-size: 24px;
            margin-top: 5px;
            /* 统一：图标到文字的间距 */
            width: 71px;
            /* 统一：文字容器宽度 */
            height: 20px;
            /* 统一：文字容器高度 */
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    /* 线-未选中 */
    .drawPloylineBodySelect .drawPolylineImg {
        background: url(../../static/image/right/draw-select.png) no-repeat;
        background-size: 100% 100%;
    }

    .drawPloylineBodySelect .drawPolylineFont {
        color: #35803b;
    }

    /* 线-选中 */
    .drawPloylineBodySelected .drawPolylineImg {
        background: url(../../static/image/right/draw-selected.png) no-repeat;
        background-size: 100% 100%;
    }

    .drawPloylineBodySelected .drawPolylineFont {
        color: #f3dfa9;
        background: url(../../static/image/right/font-selected.png) no-repeat;
        background-size: 100% 100%;
    }

    /* 3. 面模块：选中/未选中样式（与点、线模块逻辑完全一致） */
    .drawPloygonBodySelect,
    .drawPloygonBodySelected {
        cursor: pointer;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .drawPloygonImg {
            width: 56px;
            height: 56px;
            background-size: 100% 100%;
        }

        .drawPloygonFont {
            font-family: 'xianglifang';
            font-weight: 400;
            font-size: 24px;
            margin-top: 5px;
            /* 统一：图标到文字的间距 */
            width: 71px;
            /* 统一：文字容器宽度 */
            height: 20px;
            /* 统一：文字容器高度 */
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    /* 面-未选中 */
    .drawPloygonBodySelect .drawPloygonImg {
        background: url(../../static/image/right/draw-select.png) no-repeat;
        background-size: 100% 100%;
    }

    .drawPloygonBodySelect .drawPloygonFont {
        color: #35803b;
    }

    /* 面-选中 */
    .drawPloygonBodySelected .drawPloygonImg {
        background: url(../../static/image/right/draw-selected.png) no-repeat;
        background-size: 100% 100%;
    }

    .drawPloygonBodySelected .drawPloygonFont {
        color: #f3dfa9;
        background: url(../../static/image/right/font-selected.png) no-repeat;
        background-size: 100% 100%;
    }
}
</style>
