// 模拟api.js模块的导出内容
const api = {
    getGoodsList: () => [
        // 示例商品数据
        {
            id: 1,
            img: 'goods1.jpg',
            name: '示例商品1',
            publicCount: 123,
            value: 99,
            drawTime: Date.now() + 24 * 60 * 60 * 1000 // 明天此时开奖
        },
        {
            id: 2,
            img: 'goods2.jpg',
            name: '示例商品2',
            publicCount: 456,
            value: 199,
            drawTime: Date.now() + 12 * 60 * 60 * 1000 // 12小时后开奖
        }
    ],
    participateLottery: (goodsId) => {
        // 模拟参与抽奖逻辑
        console.log(`参与商品${goodsId}的抽奖`);
    },
    getParticipationRecords: () => {
        // 模拟参与记录数据
        return [];
    },
    drawLottery: (goodsId) => {
        // 模拟开奖逻辑
        console.log(`商品${goodsId}开奖`);
    }
};

// 模拟utils.js模块的导出内容
const utils = {
    checkReminderAdded: (goodsId) => false,
    addReminderToLocal: (goodsId, name, time) => {
        console.log(`添加提醒：商品${goodsId}(${name})，时间${time}`);
    },
    getParticipationCount: () => 0,
    increaseParticipationCount: () => {
        console.log('增加参与次数');
    },
    checkResetCount: () => {
        console.log('检查参与次数重置');
    },
    formatCountdown: (seconds) => {
        // 格式化倒计时为 HH:MM:SS
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }
};

// 从模拟的模块中获取所需函数
const { getGoodsList, participateLottery, getParticipationRecords, drawLottery } = api;
const { checkReminderAdded, addReminderToLocal, getParticipationCount, increaseParticipationCount, checkResetCount, formatCountdown } = utils;

// 模拟浏览器环境的window和document（避免未定义错误）
global.window = {
    onload: null,
    handleParticipate: null,
    closeModal: null,
    addReminder: null,
    goToMyParticipation: null,
    goBack: null,
    handleDraw: null,
    closeFloat: null
};
global.document = {
    getElementById: (id) => ({
        style: { display: '' },
        innerHTML: '',
        src: '',
        textContent: '',
        alt: ''
    }),
    createElement: (tag) => ({
        className: '',
        innerHTML: '',
        appendChild: () => {}
    })
};

// 页面加载初始化
window.onload = function() {
    checkResetCount();
    renderGoodsList();
    renderParticipationList();
};

// 渲染商品列表
function renderGoodsList() {
    const goodsList = getGoodsList();
    const goodsListEl = document.getElementById('goodsList');
    goodsListEl.innerHTML = '';

    goodsList.forEach(goods => {
        const isParticipated = getParticipationRecords().some(p => p.goodsId === goods.id);
        const now = new Date().getTime();
        let btnText = '免费抽奖';
        let btnClass = 'free-lottery';
        let countdown = '';

        if (isParticipated) {
            btnText = '待开奖';
            btnClass = 'wait-draw';
            const leftTime = Math.ceil((goods.drawTime - now) / 1000);
            countdown = formatCountdown(leftTime);
        }

        const goodsItem = document.createElement('div');
        goodsItem.className = 'goods-item';
        goodsItem.innerHTML = `
            <img src="${goods.img}" alt="${goods.name}" class="goods-img">
            <div class="goods-info">
                <div class="goods-name">${goods.name}</div>
                <div class="participant-count">${goods.publicCount}人已预约</div>
                <div class="price">¥0 价值¥${goods.value}</div>
            </div>
            <div class="goods-opt">
                ${countdown ? `<div class="countdown">${countdown}</div>` : ''}
                <button class="btn ${btnClass}" onclick="handleParticipate(${goods.id})">${btnText}</button>
            </div>
        `;
        goodsListEl.appendChild(goodsItem);
    });
}

// 处理参与抽奖
window.handleParticipate = function(goodsId) {
    const participationCount = getParticipationCount();
    if (participationCount >= 3) {
        showTips('每天只有3次机会哦');
        return;
    }

    const goods = getGoodsList().find(g => g.id === goodsId);
    participateLottery(goodsId);
    increaseParticipationCount();

    const isReminderAdded = checkReminderAdded(goodsId);
    if (isReminderAdded) {
        showModal2(goods);
    } else {
        showModal1(goods);
    }

    renderGoodsList();
    renderParticipationList();
};

// 显示弹框1
function showModal1(goods) {
    const modal = document.getElementById('successModal1');
    const modalImg = document.getElementById('modalGoodsImg1');
    const modalTime = document.getElementById('modalTime1');
    const now = new Date().getTime();
    const isTodayDraw = new Date(goods.drawTime).toLocaleDateString() === new Date().toLocaleDateString();

    modalImg.src = goods.img;
    modalTime.textContent = isTodayDraw ? '10:00开奖' : '明天10:00开奖';
    modal.style.display = 'flex';
}

// 显示弹框2
function showModal2(goods) {
    const modal = document.getElementById('successModal2');
    const modalImg = document.getElementById('modalGoodsImg2');
    const modalTime = document.getElementById('modalTime2');
    const now = new Date().getTime();
    const isTodayDraw = new Date(goods.drawTime).toLocaleDateString() === new Date().toLocaleDateString();

    modalImg.src = goods.img;
    modalTime.textContent = isTodayDraw ? '10:00开奖' : '明天10:00开奖';
    modal.style.display = 'flex';
}

// 关闭弹框
window.closeModal = function(modalId) {
    document.getElementById(modalId).style.display = 'none';
};

// 添加提醒
window.addReminder = function() {
    const goodsId = parseInt(document.getElementById('modalGoodsImg1').alt);
    const goods = getGoodsList().find(g => g.id === goodsId);
    const drawTime = new Date(goods.drawTime).toLocaleString();
    addReminderToLocal(goodsId, goods.name, drawTime);
    closeModal('successModal1');
    showModal2(goods);
};

// 前往我的参与页面
window.goToMyParticipation = function() {
    document.getElementById('treasureBoxPage').style.display = 'none';
    document.getElementById('myParticipationPage').style.display = 'block';
    renderParticipationList();
};

// 返回宝箱专区
window.goBack = function() {
    document.getElementById('myParticipationPage').style.display = 'none';
    document.getElementById('treasureBoxPage').style.display = 'block';
};

// 渲染参与记录列表
function renderParticipationList() {
    let participations = getParticipationRecords();
    // 排序
    participations = sortParticipations(participations);

    const participationListEl = document.getElementById('participationList');
    participationListEl.innerHTML = '';

    participations.forEach(p => {
        const now = new Date().getTime();
        let statusText = '';
        let btnText = '';
        let btnClass = '';
        let countdown = '';
        let resultHtml = '';

        switch (p.status) {
            case 1:
                statusText = '可开奖';
                btnText = '开奖';
                btnClass = 'draw-btn';
                const expireTime = p.drawTime + 24 * 60 * 60 * 1000;
                const leftTime = Math.ceil((expireTime - now) / 1000);
                countdown = formatCountdown(leftTime);
                break;
            case 2:
                statusText = '待开奖';
                btnText = '待开奖';
                btnClass = 'wait-draw';
                const drawLeftTime = Math.ceil((p.drawTime - now) / 1000);
                countdown = formatCountdown(drawLeftTime);
                break;
            case 3:
                statusText = '已过期';
                btnText = '已过期';
                btnClass = 'expired-btn';
                countdown = '00:00:00';
                break;
            case 4:
                statusText = '已开奖';
                btnText = '已开奖';
                btnClass = 'expired-btn';
                countdown = '00:00:00';
                resultHtml = '<div class="result">未中奖</div>';
                break;
        }

        const participationItem = document.createElement('div');
        participationItem.className = 'participation-item';
        participationItem.innerHTML = `
            <img src="${p.goodsImg}" alt="${p.goodsName}" class="participation-img">
            <div class="participation-info">
                <div class="participation-name">${p.goodsName}</div>
                <div class="participant-count">${getGoodsList().find(g => g.id === p.goodsId)?.publicCount || 0}人已预约</div>
                <div class="price">¥0 价值¥${p.goodsValue}</div>
                ${resultHtml}
            </div>
            <div class="participation-opt">
                <div class="countdown">${countdown}</div>
                <button class="btn ${btnClass}" onclick="handleDraw(${p.goodsId})">${btnText}</button>
            </div>
        `;
        participationListEl.appendChild(participationItem);
    });
}

// 参与记录排序
function sortParticipations(participations) {
    return participations.sort((a, b) => {
        if (a.status !== b.status) {
            return a.status - b.status;
        }
        if (a.status === 1) {
            const expireTimeA = a.drawTime + 24 * 60 * 60 * 1000;
            const expireTimeB = b.drawTime + 24 * 60 * 60 * 1000;
            return expireTimeA - expireTimeB;
        }
        if (a.status === 2) {
            return a.drawTime - b.drawTime;
        }
        return b.drawTime - a.drawTime;
    });
}

// 处理开奖
window.handleDraw = function(goodsId) {
    const p = getParticipationRecords().find(p => p.goodsId === goodsId);
    if (p.status !== 1) return;

    const goods = getGoodsList().find(g => g.id === goodsId);
    const float = document.getElementById('treasureFloat');
    const floatImg = document.getElementById('floatGoodsImg');
    const floatName = document.getElementById('floatGoodsName');
    const openingText = document.getElementById('openingText');
    const floatResult = document.getElementById('floatResult');
    const floatCloseBtn = document.getElementById('floatCloseBtn');

    floatImg.src = goods.img;
    floatName.textContent = goods.name;
    float.style.display = 'flex';

    // 模拟开奖中效果
    let dotCount = 0;
    const dotInterval = setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        openingText.textContent = `开奖中${'.'.repeat(dotCount)}`;
    }, 500);

    // 1.5秒后显示结果
    setTimeout(() => {
        clearInterval(dotInterval);
        drawLottery(goodsId);
        openingText.style.display = 'none';
        floatResult.style.display = 'block';
        floatCloseBtn.style.display = 'block';
        renderParticipationList();
    }, 1500);
};

// 关闭浮层
window.closeFloat = function() {
    document.getElementById('treasureFloat').style.display = 'none';
    document.getElementById('openingText').style.display = 'block';
    document.getElementById('openingText').textContent = '开奖中...';
    document.getElementById('floatResult').style.display = 'none';
    document.getElementById('floatCloseBtn').style.display = 'none';
};

// 显示提示
function showTips(text) {
    const tips = document.getElementById('tips');
    tips.textContent = text;
    tips.style.display = 'block';
    setTimeout(() => {
        tips.style.display = 'none';
    }, 1500);
}

// 若在浏览器环境使用ES模块，需添加以下导出（可选）
if (typeof module !== 'undefined') {
    module.exports = {
        renderGoodsList,
        renderParticipationList,
        handleParticipate: window.handleParticipate,
        handleDraw: window.handleDraw  // 修复：引用window上的handleDraw
    };
}
