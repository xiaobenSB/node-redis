const redis = require('redis');
/*const client = redis.createClient( 6379, '127.0.0.1');
      client.select(2);  //  切换到指定的数据库，数据库索引号 index 用数字值指定，以 0 作为起始索引值。
*/

class NodeRedis{
	
	constructor(port,domain,whereLibrary = 0) {
		this.client = redis.createClient( port, domain);
		this.hSelect(whereLibrary);
		this.client.on("error",this.error);
	}
	
	//  选择哪个库
	hSelect(index){
		this.client.select(index)
	}
	
	//  增加（hash）
	hmAdd(key,arr){
		var that = this;
			that.client.exists(key,function(err,data){
				if(err){
					 console.log('键名: ' + key + ',判断是否存在时发生错误---(执行hmAdd方法时)');
				}else{
					if(data) {
						 console.log('键名: ' + key + ',已存在---(执行hmAdd方法时)');
						return;
					};
					that.client.hmset(key,arr,function(err,data){
					  if(err) {
						  console.log('键名: ' + key + '添加（hmset）时发生错误');
						  return;
					  };
					  console.log(data);
					});
				};
			});
	}
	
	//  设置（hash）
    hSet(key,subKey,value){
		var that = this;
			that.client.hexists(key,subKey,function(err,data){
				if(err){
					 console.log('键名: ' + key + ',子键名: ' + subKey + ',判断是否存在时发生错误---(执行hSet方法时)');
				}else{
					if(!data) {
						 console.log('键名: ' + key + ',子键名: ' + subKey + ',不存在---(执行hSet方法时)');
						return;
					};
					that.client.hset(key,subKey,value,function(err,data){
					  if(err) {
						  console.log('键名: ' + key + ',子键名: ' + subKey + ',设置（hset）时发生错误');
						  return;
					  };
					  console.log(data);
					});
				};
			});
	}
	
	//  （数字增加多少）对应的value必须是数字（hash）
	hIncrby(key,subKey,increment){
		var that = this;
			that.client.hexists(key,subKey,function(err,data){
				if(err){
					 console.log('键名: ' + key + ',子键名: ' + subKey + ',判断是否存在时发生错误---(执行hIncrby方法时)');
				}else{
					if(!data) {
						 console.log('键名: ' + key + ',子键名: ' + subKey + ',不存在---(执行hIncrby方法时)');
						return;
					};
					that.client.hincrby(key,subKey,increment,function(err,data){
					  if(err) {
						  console.log('键名: ' + key + ',子键名: ' + subKey + ',增加（hincrby）时发生错误');
						  return;
					  };
					  console.log(data);
					});
				};
			});
	}
	
	//  返回字符串形式（hash）
	hGet(key,subKey){
		var that = this;
			that.client.hexists(key,subKey,function(err,data){
				if(err){
					 console.log('键名: ' + key + ',子键名: ' + subKey + ',判断是否存在时发生错误---(执行hGet方法时)');
				}else{
					if(!data) {
						 console.log('键名: ' + key + ',子键名: ' + subKey + ',不存在---(执行hGet方法时)');
						return;
					};
					that.client.hget(key,subKey,function(err,data){
					  if(err) {
						  console.log('键名: ' + key + ',子键名: ' + subKey + ',获取（hGet）值时发生错误');
						  return;
					  };
					  console.log(data);
					});
				};
			});
	}
	
	//  返回数组形式（hash）
	hmGet(key,subKey){
		var that = this;
			that.client.hexists(key,subKey,function(err,data){
				if(err){
					 console.log('键名: ' + key + ',子键名: ' + subKey + ',判断是否存在时发生错误---(执行hmGet方法时)');
				}else{
					if(!data) {
						 console.log('键名: ' + key + ',子键名: ' + subKey + ',不存在---(执行hmGet方法时)');
						return;
					};
					that.client.hmget(key,subKey,function(err,data){
					  if(err) {
						  console.log('键名: ' + key + ',子键名: ' + subKey + ',获取（hmGet）值时发生错误');
						  return;
					  };
					  console.log(data);
					});
				};
			});
	}
	
	//  删除（hash）
	hDel(key,subKey){
		var that = this;
			that.client.hexists(key,subKey,function(err,data){
					if(err){
						 console.log('键名: ' + key + ',子键名: ' + subKey + ',判断是否存在时发生错误---(执行hDel方法时)');
					}else{
						if(!data) {
							 console.log('键名: ' + key + ',子键名: ' + subKey + ',不存在---(执行hDel方法时)');
							return;
						};
						that.client.hdel(key,subKey,function(err,data){
						  if(err) {
							  console.log('键名: ' + key + ',子键名: ' + subKey + ',删除（hDel）值时发生错误');
							  return;
						  };
						});
					};
				});
	}
	
	//  添加
	set(key,value){
		var that = this;
			that.client.exists(key,function(err,data){
				if(err){
					 console.log('键名: ' + key + ',判断是否存在时发生错误---(执行set方法时)');
				}else{
					if(data) {
						 console.log('键名: ' + key + ',已存在---(执行set方法时)');
						return;
					};
					that.client.set(key,value,function(err,data){
					  if(err) {
						  console.log('键名: ' + key + '添加（set）时发生错误');
						  return;
					  };
					  console.log(data);
					});
				};
			});
	}
	
	/**
     * NX 当key不存在时设置，存在时不操作
     * PX 过期时间
     * @param key
     * @param value
     * @param expireTime 过期时间
     */
    setNX(key, value, expireTime) {   //   可以用来做请求同步限制
		var that = this;
       /* return new Promise((resolve,reject) =>{
            that.client.set(key, value, 'EX', expireTime, 'NX', (err, reply) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!reply) {
					console.log(key,5411411);
                    reject('请勿重复操作')
                    return
                }
				console.log(key,8888888);
                resolve(reply)
            })
        })*/
		that.client.set(key, value, 'EX', expireTime,'NX', (err, reply) => {
			if (err) {
				console.log('插入时发生了错误');
				console.log(err);
			};
        });
    }
	
	//  获取
	get(key){
		var that = this;
			that.client.exists(key,function(err,data){
				if(err){
					 console.log('键名: ' + key + ',判断是否存在时发生错误---(执行get方法时)');
				}else{
					if(!data) {
						 console.log('键名: ' + key + ',不存在---(执行get方法时)');
						return;
					};
					that.client.get(key,function(err,data){
					  if(err) {
						  console.log('键名: ' + key + '获取（get）时发生错误');
						  return;
					  };
					  console.log(data);
					  console.timeEnd("RunoobN2");
					});
				};
			});
	}
	
	//  设置过期时间(参数单位为: 秒)
	setExpire(key,seconds){
		var that = this;
			that.client.exists(key,function(err,data){
				if(err){
					 console.log('键名: ' + key + ',判断是否存在时发生错误---(执行setExpire方法时)');
				}else{
					if(!data) {
						 console.log('键名: ' + key + ',不存在---(执行setExpire方法时)');
						return;
					};
					that.client.expire(key,seconds,function(err,data){
					  if(err) {
						  console.log('键名: ' + key + '设置（setExpire）时发生错误');
						  return;
					  };
					  console.log(data);
					});
				};
			});
	}
	
	//  删除(主键删除)
	keyDel(key){
		var that = this;
			that.client.exists(key,function(err,data){
				if(err){
					 console.log('键名: ' + key + ',判断是否存在时发生错误---(执行keyDel方法时)');
				}else{
					if(!data) {
						 console.log('键名: ' + key + ',不存在---(执行keyDel方法时)');
						return;
					};
					that.client.del(key,function(err,data){
					  if(err) {
						  console.log('键名: ' + key + '删除（del）时发生错误');
						  return;
					  };
					});
				};
			});
	}
	
	error(err){
		console.log(err);
	}
	
};
