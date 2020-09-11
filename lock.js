class RedisLock {
    /**
     * 初始化 RedisLock
     * @param {*} client
     * @param {*} options
     */
    constructor (client, options={}) {
        if (!client) {
            throw new Error('client 不存在');
        }

        if (client.status !== 'connecting') {
            throw new Error('client 未正常链接');
        }

        this.lockLeaseTime = options.lockLeaseTime || 2; // 默认锁过期时间 2 秒
        this.lockTimeout = options.lockTimeout || 5; // 默认锁超时时间 5 秒
        this.expiryMode = options.expiryMode || 'EX';
        this.setMode = options.setMode || 'NX';
        this.client = client;
    }
	
	 /**
     * 上锁
     * @param {*} key
     * @param {*} val
     * @param {*} expire
     */
    async lock(key, val, expire) {
        const start = Date.now();
        const self = this;

        return (async function intranetLock() {
            try {
			/*	SET KEY VALUE [EX seconds] [PX milliseconds] [NX|XX]
				EX seconds − 设置指定的到期时间(以秒为单位)。
				PX milliseconds - 设置指定的到期时间(以毫秒为单位)。
				NX - 仅在键不存在时设置键。
				XX - 只有在键已存在时才设置。  */
                const result = await self.client.set(key, val, self.expiryMode, expire || self.lockLeaseTime, self.setMode);
        
                // 上锁成功
                if (result === 'OK') {
                    console.log(`${key} ${val} 上锁成功`);
                    return true;
                }

                // 锁超时
                if (Math.floor((Date.now() - start) / 1000) > self.lockTimeout) {
                    console.log(`${key} ${val} 上锁重试超时结束`);
                    return false;
                }

                // 循环等待重试
                console.log(`${key} ${val} 等待重试`);
                await sleep(3000);
                console.log(`${key} ${val} 开始重试`);

                return intranetLock();
            } catch(err) {
                throw new Error(err);
            }
        })();
    }
	
	/**
     * 释放锁
     * @param {*} key
     * @param {*} val
     */
    async unLock(key, val) {
        const self = this;
        const script = "if redis.call('get',KEYS[1]) == ARGV[1] then" +
        "   return redis.call('del',KEYS[1]) " +
        "else" +
        "   return 0 " +
        "end";

        try {
			//  1 的作用是为了KEYS[1]ARGV[1],代表有一个键值参数对应传的 3,4,    2的话对应参数 3,4,5,6(KEYS[1] == 3 ARGV[1] == 5 KEYS[2] == 4 ARGV[2] == 6)
            const result = await self.client.eval(script, 1, key, val);  

            if (result === 1) {
                return true;
            }else{
				console.log('该键对应的值不一样,应该是锁到期但当前还没处理完成,所以当前没有拥有锁（其他地方可能获取到了）,不能删除,以免导致其他地方的锁还没释放让其他地方又获取到锁');
			}
            
            return false;
        } catch(err) {
            throw new Error(err);
        }
    }
};



const Redis = require("ioredis");
const redis = new Redis(6379, "127.0.0.1");
const uuid = require('uuid');
const redisLock = new RedisLock(redis);

function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(function() {
            resolve();
        }, time || 1000);
    });
}

async function test(key) {
    try {
        const id = uuid.v1();
        await redisLock.lock(key, id, 3);
        await sleep(6000);
        
        const unLock = await redisLock.unLock(key, id);
        console.log('unLock: ', key, id, unLock);
    } catch (err) {
        console.log('上锁失败', err);
    }
}


/*redis.set('ceshi', 'xiaoben', 'EX', 5, 'NX').then(function(result){
	  console.log(result);
});
redis.set('ceshi', 'xiaoben2', 'EX', 5, 'NX').then(function(result){
	  console.log(result);
});
redis.set('ceshi', 'xiaoben3', 'EX', 5, 'NX').then(function(result){
	  console.log(result);
});
redis.set('ceshi', 'xiaoben4', 'EX', 5, 'NX').then(function(result){
	  console.log(result);
});
redis.set('ceshi', 'xiaoben5', 'EX', 5, 'NX').then(function(result){
	  console.log(result);
});
redis.set('ceshi', 'xiaoben6', 'EX', 5, 'NX').then(function(result){
	  console.log(result);
});*/


test('name1');
test('name1');
