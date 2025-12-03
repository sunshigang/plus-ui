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
            <div class="layerContentA" v-show="showRemarkColumn">
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
                                <div class="scrollDetailFontA">{{ item.layerName }}</div>
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
        <div class="arrow" :style="arrowStyle"></div>
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
        <div class="circle-container">
            <div class="circle" :class="{ solid: isSelected[0] }" v-hasPermi="['screen:function:redline']"></div>
            <div class="circle" :class="{ solid: isSelected[1] }" v-hasPermi="['screen:function:splitscreen']"></div>
            <div class="circle" :class="{ solid: isSelected[2] }" v-hasPermi="['screen:function:analysis']"></div>
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
import { toRefs, reactive, ref, onMounted, onUnmounted, computed, watch } from 'vue' // 新增 onUnmounted
import bus from '../../libs/eventbus'
import { getMarkList } from "./remark.js";

// 存储所有选中的图层名称（去重）
const selectedLayerNames = ref([]);
const currentModule = ref('')
const showRemarkColumn = ref(false)

// 核心方法：更新选中的图层名称列表并发送事件
const updateSelectedLayerNames = () => {
    selectedLayerNames.value = [];
    const allCheckGroups = [
        checkItemsA, checkItemsB, checkItemsC, checkItemsD, checkItemsE,
        checkItemsF, checkItemsG, checkItemsH, checkItemsI, checkItemsJ,
        checkItemsK
    ];
    if (showRemarkColumn.value) {
        allCheckGroups.push(checkItemsRemark);
    }
    allCheckGroups.forEach(group => {
        group.value.forEach(item => {
            if (item.checked) {
                let displayName = '';
                if (item.isRemark || checkItemsRemark.value.includes(item)) {
                    displayName = item.layerName || item.name || item.label;
                } else {
                    displayName = item.label || item.name;
                }
                if (displayName) {
                    selectedLayerNames.value.push(displayName);
                }
            }
        });
    });
    selectedLayerNames.value = [...new Set(selectedLayerNames.value)];
    bus.emit('layerNamesSelected', selectedLayerNames.value);
    bus.emit('legend-visibility', selectedLayerNames.value.length > 0);
    console.log('当前选中的图层名称：', selectedLayerNames.value);
    console.log('备注项选中情况：', checkItemsRemark.value.filter(item => item.checked));
};

// 全选框状态
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

// 全选框事件处理
const handleAllCheckA = (isChecked) => {
    checkItemsA.value.forEach(item => {
        item.checked = isChecked;
        handleCheckChangeA(item);
    });
    updateSelectedLayerNames();
};
const handleAllCheckB = (isChecked) => {
    checkItemsB.value.forEach(item => {
        item.checked = isChecked;
        handleCheckChangeB(item);
    });
    updateSelectedLayerNames();
};
const handleAllCheckC = (isChecked) => {
    checkItemsC.value.forEach(item => {
        item.checked = isChecked;
        handleCheckChangeC(item);
    });
    updateSelectedLayerNames();
};
const handleAllCheckD = (isChecked) => {
    checkItemsD.value.forEach(item => {
        item.checked = isChecked;
        handleCheckChangeD(item);
    });
    updateSelectedLayerNames();
};
const handleAllCheckE = (isChecked) => {
    checkItemsE.value.forEach(item => {
        item.checked = isChecked;
        handleCheckChangeE(item);
    });
    updateSelectedLayerNames();
};
const handleAllCheckF = (isChecked) => {
    checkItemsF.value.forEach(item => {
        item.checked = isChecked;
        handleCheckChangeF(item);
    });
    updateSelectedLayerNames();
};
const handleAllCheckG = (isChecked) => {
    checkItemsG.value.forEach(item => {
        item.checked = isChecked;
        handleCheckChangeG(item);
    });
    updateSelectedLayerNames();
};
const handleAllCheckH = (isChecked) => {
    checkItemsH.value.forEach(item => {
        item.checked = isChecked;
        handleCheckChangeH(item);
    });
    updateSelectedLayerNames();
};
const handleAllCheckI = (isChecked) => {
    checkItemsI.value.forEach(item => {
        item.checked = isChecked;
        handleCheckChangeI(item);
    });
    updateSelectedLayerNames();
};
const handleAllCheckJ = (isChecked) => {
    checkItemsJ.value.forEach(item => {
        item.checked = isChecked;
        handleCheckChangeJ(item);
    });
    updateSelectedLayerNames();
};
const handleAllCheckK = (isChecked) => {
    checkItemsK.value.forEach(item => {
        item.checked = isChecked;
        handleCheckChangeK(item);
    });
    updateSelectedLayerNames();
};
const handleAllCheckRemark = (isChecked) => {
    checkItemsRemark.value.forEach(item => {
        item.checked = isChecked;
        handleCheckChangeRemark(item);
    });
    updateSelectedLayerNames();
    bus.emit('layerNamesSelected', selectedLayerNames.value);
};

// 图层选项数据
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
const checkItemsRemark = ref([])

// 通用复选框事件处理
const handleCheckChangeCommon = (item, layerType) => {
    console.log(`Item ${item.id} (${layerType}) checked: ${item.checked}`);
    bus.emit('layerCheckMessage', {
        id: item.id,
        name: item.name,
        checked: item.checked,
        layerType: layerType
    });
};

// 单个复选框事件处理
const handleCheckChangeA = item => {
    console.log(`Item ${item.id} checked: ${item.checked}`)
    bus.emit('attractionTypeMessage', item)
    updateSelectedLayerNames();
}
const handleCheckChangeB = item => {
    console.log(`Item ${item.id} checked: ${item.checked}`)
    bus.emit('cultureTypeMessage', item)
    updateSelectedLayerNames();
}
const handleCheckChangeC = (item) => {
    handleCheckChangeCommon(item, 'Line')
    updateSelectedLayerNames();
};
const handleCheckChangeD = (item) => {
    handleCheckChangeCommon(item, 'Line')
    updateSelectedLayerNames();
};
const handleCheckChangeE = (item) => {
    handleCheckChangeCommon(item, 'Line')
    updateSelectedLayerNames()
};
const handleCheckChangeF = (item) => {
    handleCheckChangeCommon(item, 'Area')
    updateSelectedLayerNames()
};
const handleCheckChangeG = (item) => {
    handleCheckChangeCommon(item, 'Area')
    updateSelectedLayerNames()
};
const handleCheckChangeH = (item) => {
    handleCheckChangeCommon(item, 'Area')
    updateSelectedLayerNames()
};
const handleCheckChangeI = (item) => {
    handleCheckChangeCommon(item, 'Area')
    updateSelectedLayerNames()
};
const handleCheckChangeJ = (item) => {
    handleCheckChangeCommon(item, 'Area')
    updateSelectedLayerNames()
};
const handleCheckChangeK = (item) => {
    handleCheckChangeCommon(item, 'Area')
    updateSelectedLayerNames()
};
const handleCheckChangeRemark = item => {
    console.log(`Item ${item.id} checked: ${item.checked}`)
    bus.emit('remarkMessage', item)
    updateSelectedLayerNames()
}

// 图层展开/折叠事件
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

// 生态保护红线单独选中逻辑
const setOnlyEcoRedlineChecked = (isChecked) => {
    checkItemsJ.value.forEach((item) => {
        item.checked = isChecked;
        handleCheckChangeJ(item);
    });
    isAllCheckedJ.value = isChecked;
    layerContentStyleJ.value = isChecked;

    [isAllCheckedA, isAllCheckedB, isAllCheckedC, isAllCheckedD, isAllCheckedE,
        isAllCheckedF, isAllCheckedG, isAllCheckedH, isAllCheckedI, isAllCheckedK].forEach(checkedRef => {
            checkedRef.value = false;
        });
    [layerContentStyleA, layerContentStyleB, layerContentStyleC, layerContentStyleD, layerContentStyleE,
        layerContentStyleF, layerContentStyleG, layerContentStyleH, layerContentStyleI, layerContentStyleK].forEach(styleRef => {
            styleRef.value = false;
        });

    checkItemsRemark.value.forEach(item => item.checked = false);
    isAllCheckedRemark.value = false;
    layerContentStyleRemark.value = false;
    updateSelectedLayerNames();
};

// 功能面板选中状态
const isSelected = ref({
    0: false,
    1: false,
    2: false
})

// 功能面板按钮点击事件
const selectItem = (index) => {
    isSelected.value[index] = !isSelected.value[index]
    if (index === 0) {
        layerManagementShowHide.value = true
        setOnlyEcoRedlineChecked(isSelected.value[index]);
    } else if (index === 1) {
        layerManagementShowHide.value = false
    } else {
        layerManagementShowHide.value = true
    }
    bus.emit('function-panel-clicked', { index, isSelected: isSelected.value[index] })
}

// 箭头样式计算
const arrowStyle = computed(() => {
    const topValues = [
        '2px',
        '43px',
        '83px'
    ]
    let lastSelectedIndex = -1
    for (let i = 2; i >= 0; i--) {
        if (isSelected.value[i]) {
            lastSelectedIndex = i
            break
        }
    }
    return {
        top: lastSelectedIndex > -1 ? topValues[lastSelectedIndex] : '2px',
        display: lastSelectedIndex > -1 ? 'block' : 'none',
        transition: 'top 0.3s ease, display 0.3s ease'
    }
})

// 绘制功能状态
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
const drawPloygonBodyStyle = ref(false)
const drawPloylineBodyStyle = ref(false)
const drawPointBodyStyle = ref(false)

// 绘制功能点击事件
const clickDrawPloygon = () => {
    drawPloygonBodyStyle.value = !drawPloygonBodyStyle.value
    if (drawPloygonBodyStyle.value) {
        drawPointBodyStyle.value = false
        drawPloylineBodyStyle.value = false
    }
    bus.emit('draw-polygon-clicked', drawPloygonBodyStyle.value)
}
const clickDrawPloyline = () => {
    drawPloylineBodyStyle.value = !drawPloylineBodyStyle.value
    if (drawPloylineBodyStyle.value) {
        drawPointBodyStyle.value = false
        drawPloygonBodyStyle.value = false
    }
    bus.emit('draw-polyline-clicked', drawPloylineBodyStyle.value)
}
const clickDrawPoint = () => {
    drawPointBodyStyle.value = !drawPointBodyStyle.value
    if (drawPointBodyStyle.value) {
        drawPloylineBodyStyle.value = false
        drawPloygonBodyStyle.value = false
    }
    bus.emit('draw-point-clicked', drawPointBodyStyle.value)
}

// 监听子项变化同步全选框
watch(
    () => checkItemsA.value.map(item => item.checked),
    (checkedList) => {
        isAllCheckedA.value = checkedList.every(checked => checked);
        updateSelectedLayerNames();
    },
    { deep: true }
);
watch(
    () => checkItemsB.value.map(item => item.checked),
    (checkedList) => {
        isAllCheckedB.value = checkedList.every(checked => checked);
        updateSelectedLayerNames();
    },
    { deep: true }
);
watch(
    () => checkItemsC.value.map(item => item.checked),
    (checkedList) => {
        isAllCheckedC.value = checkedList.every(checked => checked);
        updateSelectedLayerNames();
    },
    { deep: true }
);
watch(
    () => checkItemsD.value.map(item => item.checked),
    (checkedList) => {
        isAllCheckedD.value = checkedList.every(checked => checked);
        updateSelectedLayerNames();
    },
    { deep: true }
);
watch(
    () => checkItemsE.value.map(item => item.checked),
    (checkedList) => {
        isAllCheckedE.value = checkedList.every(checked => checked);
        updateSelectedLayerNames();
    },
    { deep: true }
);
watch(
    () => checkItemsF.value.map(item => item.checked),
    (checkedList) => {
        isAllCheckedF.value = checkedList.every(checked => checked);
        updateSelectedLayerNames();
    },
    { deep: true }
);
watch(
    () => checkItemsG.value.map(item => item.checked),
    (checkedList) => {
        isAllCheckedG.value = checkedList.every(checked => checked);
        updateSelectedLayerNames();
    },
    { deep: true }
);
watch(
    () => checkItemsH.value.map(item => item.checked),
    (checkedList) => {
        isAllCheckedH.value = checkedList.every(checked => checked);
        updateSelectedLayerNames();
    },
    { deep: true }
);
watch(
    () => checkItemsI.value.map(item => item.checked),
    (checkedList) => {
        isAllCheckedI.value = checkedList.every(checked => checked);
        updateSelectedLayerNames();
    },
    { deep: true }
);
watch(
    () => checkItemsJ.value[0]?.checked,
    (isChecked) => {
        if (isChecked !== undefined) {
            isSelected.value[0] = isChecked;
        }
        updateSelectedLayerNames();
    },
    { deep: true }
);
watch(
    () => checkItemsK.value.map(item => item.checked),
    (checkedList) => {
        isAllCheckedK.value = checkedList.every(checked => checked);
        updateSelectedLayerNames();
    },
    { deep: true }
);
watch(
    () => checkItemsRemark.value.map(item => item.checked),
    (checkedList) => {
        isAllCheckedRemark.value = checkedList.every(checked => checked);
        updateSelectedLayerNames();
    },
    { deep: true }
);

// ========== 提取Bus回调为命名函数（精准解绑） ==========
const handleSchemeReviewClicked = (data) => {
    console.log('方案审查可见性:', data)
    const { isShow, module } = data
    currentModule.value = module
    layerManagementShowHide.value = isShow
    functionPanelShowHide.value = isShow
    showRemarkColumn.value = false
    if (!isShow) {
        drawFunctionShowHide.value = isShow
    } else {
        drawFunctionShowHide.value = false
    }
    getMarkList().then((res) => {
        checkItemsRemark.value = res.rows
        bus.emit('updateRemarkLegend', res.rows);
        checkItemsRemark.value.forEach(item => item.checked = false);
        isAllCheckedRemark.value = false;
        layerContentStyleRemark.value = false;
        updateSelectedLayerNames();
    }).catch((error) => {
        console.error('获取标注信息失败', error);
    });
}

const handlePlanningAchievementClicked = (data) => {
    const { isShow, module } = data
    console.log("🚀 ~ handlePlanningAchievementClicked ~ isShow:", isShow)
    currentModule.value = module
    layerManagementShowHide.value = isShow
    functionPanelShowHide.value = false
    showRemarkColumn.value = true
    if (isShow) {
        // 避免重复切换：仅当未选中时才触发选中
        if (!isSelected.value[2]) {
            isSelected.value[2] = true // 直接设置选中状态（避免toggle反转）
            // 触发时空分析选中的业务逻辑
            layerManagementShowHide.value = true
            bus.emit('function-panel-clicked', { index: 2, isSelected: true })
        }
    } else {
        // 规划成果隐藏时，取消时空分析选中
        if (isSelected.value[2]) {
            isSelected.value[2] = false
            bus.emit('function-panel-clicked', { index: 2, isSelected: false })
        }
    }
    getMarkList().then((res) => {
        const formattedRemark = res.rows.map(item => ({
            ...item,
            layerName: item.layerName || item.name || `未命名备注${item.id}`,
            checked: item.checked || false,
            rgb: item.rgb || 'rgb(252, 218, 78)'
        }));
        checkItemsRemark.value = formattedRemark;
        bus.emit('updateRemarkLegend', formattedRemark);
        updateSelectedLayerNames();
    }).catch((error) => {
        console.error('获取标注信息失败', error);
    });
}

const handleVectorLayerClicked = (isVisible) => {
    drawFunctionShowHide.value = isVisible
    if (isVisible == false) {
        layerManagementShowHide.value = false
        functionPanelShowHide.value = false
    } else {
        layerManagementShowHide.value = false
        functionPanelShowHide.value = false
    }
}

// ========== 挂载/卸载生命周期 ==========
onMounted(() => {
    updateSelectedLayerNames();
    setOnlyEcoRedlineChecked(isSelected.value[0]);
    isAllCheckedRemark.value = false;
    // 绑定Bus事件（命名函数）
    bus.on('scheme-review-clicked', handleSchemeReviewClicked);
    bus.on('planning-achievement-clicked', handlePlanningAchievementClicked);
    bus.on('vector-layer-clicked', handleVectorLayerClicked);
})

onUnmounted(() => {
    // ========== 1. 精准解绑所有Bus事件 ==========
    bus.off('scheme-review-clicked', handleSchemeReviewClicked);
    bus.off('planning-achievement-clicked', handlePlanningAchievementClicked);
    bus.off('vector-layer-clicked', handleVectorLayerClicked);

    // ========== 2. 重置所有响应式状态 ==========
    // 基础状态
    selectedLayerNames.value = [];
    currentModule.value = '';
    showRemarkColumn.value = false;

    // 全选框状态
    isAllCheckedA.value = false;
    isAllCheckedB.value = false;
    isAllCheckedC.value = false;
    isAllCheckedD.value = false;
    isAllCheckedE.value = false;
    isAllCheckedF.value = false;
    isAllCheckedG.value = false;
    isAllCheckedH.value = false;
    isAllCheckedI.value = false;
    isAllCheckedJ.value = false;
    isAllCheckedK.value = false;
    isAllCheckedRemark.value = false;

    // 图层展开/折叠状态
    layerContentStyleA.value = false;
    layerContentStyleB.value = false;
    layerContentStyleC.value = false;
    layerContentStyleD.value = false;
    layerContentStyleE.value = false;
    layerContentStyleF.value = false;
    layerContentStyleG.value = false;
    layerContentStyleH.value = false;
    layerContentStyleI.value = false;
    layerContentStyleJ.value = false;
    layerContentStyleK.value = false;
    layerContentStyleRemark.value = false;

    // 绘制功能状态
    drawFunctionShowHide.value = false;
    drawPloygonBodyStyle.value = false;
    drawPloylineBodyStyle.value = false;
    drawPointBodyStyle.value = false;

    // 功能面板状态
    layerManagementShowHide.value = false;
    functionPanelShowHide.value = false;
    isSelected.value = { 0: false, 1: false, 2: false };

    // 清空所有复选框选中状态
    [
        checkItemsA, checkItemsB, checkItemsC, checkItemsD, checkItemsE,
        checkItemsF, checkItemsG, checkItemsH, checkItemsI, checkItemsJ,
        checkItemsK, checkItemsRemark
    ].forEach(group => {
        group.value.forEach(item => item.checked = false);
    });

    // ========== 3. 兜底清理DOM事件 ==========
    const rightSidebar = document.querySelector('.rightSidebar');
    const functionPanel = document.querySelector('.functionPanel');
    const drawFunctionBody = document.querySelector('.drawFunctionBody');
    if (rightSidebar) rightSidebar.onclick = null;
    if (functionPanel) functionPanel.onclick = null;
    if (drawFunctionBody) drawFunctionBody.onclick = null;

    // ========== 4. 通知其他组件重置状态 ==========
    bus.emit('layerNamesSelected', []);
    bus.emit('legend-visibility', false);
    bus.emit('function-panel-clicked', { index: -1, isSelected: false });
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
        overflow-y: auto;
        padding: 0 5px;

        &::-webkit-scrollbar {
            width: 6px;
        }

        &::-webkit-scrollbar-thumb {
            background-color: rgba(255, 207, 112, 0.01);
            border-radius: 3px;
        }

        &::-webkit-scrollbar-track {
            background-color: transparent;
        }

        .layerContentA {
            margin-top: 10px;

            .layerContentTitle {
                position: relative;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                width: 85%;
                height: 34px;
                margin-left: 18px;

                .scroll-custom-checkbox {
                    position: absolute;
                    right: 35px;
                    top: 50%;
                    transform: translateY(-50%);
                    margin: 0;
                    z-index: 1;

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
            }

            .scrollContentA {
                width: 77%;
                max-height: 110px;
                overflow-y: auto;

                &::-webkit-scrollbar {
                    width: 6px;
                }

                &::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 207, 112, 0.01);
                    border-radius: 3px;
                }

                &::-webkit-scrollbar-track {
                    background-color: transparent;
                }

                font-family: 'SourceHanSansCN-Medium';
                font-weight: 400;
                font-size: 15px;
                color: #ffffff;
                line-height: 36px;
                display: flex;
                flex-direction: column;
                margin-left: 40px;

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
    display: flex;
    flex-direction: row;
    align-items: center;

    .arrow {
        width: 42px;
        height: 44px;
        background: url(../../static/image/right/arrow.png) no-repeat;
        background-size: 100% 100%;
        position: absolute;
        left: 0;
        transition: top 0.3s ease;
    }

    .text-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-right: 20px;
        margin-left: 40px;

        .text-item {
            width: 147px;
            height: 28px;
            font-family: 'xianglifang';
            font-weight: 400;
            font-size: 24px;
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

        .circle.solid {
            background-color: #ffa621;
            border: none;
            width: 10px;
            height: 10px;
        }
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
            width: 71px;
            height: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .drawPointBodySelect .drawPointImg {
        background: url(../../static/image/right/draw-select.png) no-repeat;
        background-size: 100% 100%;
    }

    .drawPointBodySelect .drawPointFont {
        color: #35803b;
    }

    .drawPointBodySelected .drawPointImg {
        background: url(../../static/image/right/draw-selected.png) no-repeat;
        background-size: 100% 100%;
    }

    .drawPointBodySelected .drawPointFont {
        color: #f3dfa9;
        background: url(../../static/image/right/font-selected.png) no-repeat;
        background-size: 100% 100%;
    }

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
            width: 71px;
            height: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .drawPloylineBodySelect .drawPolylineImg {
        background: url(../../static/image/right/draw-select.png) no-repeat;
        background-size: 100% 100%;
    }

    .drawPloylineBodySelect .drawPolylineFont {
        color: #35803b;
    }

    .drawPloylineBodySelected .drawPolylineImg {
        background: url(../../static/image/right/draw-selected.png) no-repeat;
        background-size: 100% 100%;
    }

    .drawPloylineBodySelected .drawPolylineFont {
        color: #f3dfa9;
        background: url(../../static/image/right/font-selected.png) no-repeat;
        background-size: 100% 100%;
    }

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
            width: 71px;
            height: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .drawPloygonBodySelect .drawPloygonImg {
        background: url(../../static/image/right/draw-select.png) no-repeat;
        background-size: 100% 100%;
    }

    .drawPloygonBodySelect .drawPloygonFont {
        color: #35803b;
    }

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