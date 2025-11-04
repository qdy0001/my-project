import { getRandomStartCount } from './utils.js';

// 模拟商品数据
export const goodsList = [
    {
        id: 1,
        name: 'iphone17',
        img: 'images/iphone17.jpg',
        value: 8000,
        drawTime: new Date(Date.now() + 24 * 60 * 60 * 1000).getTime() // 明天10:00
    },
    {
        id: 2,
        name: '苹果电脑',
        img: 'images/mac.jpg',
        value: 8000,
        drawTime: new Date(Date.now() + 24 * 60 * 60 * 1000).getTime()
    },
    {
        id: 3,
        name: '香奈儿包',
        img: 'images/chanel.jpg',
        value: 8000,
        drawTime: new Date(Date.now() + 24 * 60 * 60 * 1000).getTime()
    },
    {
        id: 4,
        name: '华为手机',
        img: 'images/huawei.jpg',
        value: 8000,
        drawTime: new Date(Date.now() + 24 * 60 * 60 * 1000).getTime()
    }
];

// 获取商品列表
export function getGoodsList() {
    return goodsList.map(goods => {
        const startCount = getRandomStartCount();
        // 模拟公屏人数（实际人数*10，每10分钟更新）
        const publicCount = startCount + Math.floor(Math.random() * 100) * 10;
        return {
            ...goods,
            startCount,
            publicCount,
            privateCount: startCount + (localStorage.getItem(`goods_${goods.id}_count`) || 0)
        };
    });
}

// 用户参与抽奖
export function participateLottery(goodsId) {
    // 更新私屏人数
    const key = `goods_${goodsId}_count`;
    const currentCount = localStorage.getItem(key) || 0;
    localStorage.setItem(key, parseInt(currentCount) + 1);

    // 记录参与信息
    const participationInfo = {
        goodsId,
        joinTime: new Date().getTime(),
        status: 2 // 待开奖
    };
    const participations = JSON.parse(localStorage.getItem('participations') || '[]');
    participations.push(participationInfo);
    localStorage.setItem('participations', JSON.stringify(participations));
}

// 获取用户参与记录
export function getParticipationRecords() {
    const participations = JSON.parse(localStorage.getItem('participations') || '[]');
    // 过滤60天内的数据
    const sixtyDaysAgo = new Date().getTime() - 60 * 24 * 60 * 60 * 1000;
    return participations.filter(p => p.joinTime >= sixtyDaysAgo).map(p => {
        const goods = goodsList.find(g => g.id === p.goodsId);
        const now = new Date().getTime();
        let status = p.status;

        // 更新状态
        if (status === 2 && now >= goods.drawTime) {
            status = 1; // 待开奖->可开奖
            p.status = 1;
        }
        if (status === 1) {
            const expireTime = goods.drawTime + 24 * 60 * 60 * 1000;
            if (now >= expireTime) {
                status = 3; // 可开奖->已过期
                p.status = 3;
            }
        }

        localStorage.setItem('participations', JSON.stringify(participations));

        return {
            ...p,
            goodsName: goods.name,
            goodsImg: goods.img,
            goodsValue: goods.value,
            drawTime: goods.drawTime,
            status
        };
    });
}

// 开奖
export function drawLottery(goodsId) {
    const participations = JSON.parse(localStorage.getItem('participations') || '[]');
    const index = participations.findIndex(p => p.goodsId === goodsId);
    if (index !== -1) {
        participations[index].status = 4; // 已开奖未中奖
        localStorage.setItem('participations', JSON.stringify(participations));
    }
    return false; // 固定未中奖
}
