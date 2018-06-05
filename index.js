/*
const cluster = require('cluster');
const http = require('http');
const nums = require('os').cpus().length;


// 当前如果是主线程
if (cluster.isMaster) {
  // 循环 fork 任务
  for (let i = 0; i < nums; i++) {
    const worker = cluster.fork()

    worker.on('online', () => {
      worker.send(` wo ai ni`)
    })
  }


  
  // 打印当前主线程
  console.log(`主线程运行在${process.pid}`)
  // 监听 exit 事件

  cluster.on('message', (worker, msg, handle) => {

    console.log(worker.id + msg)
  })
// 当前如果是工作线程
} else {
  // 打印当前子线程
  // process.send({ cmd: '1', data: 'Hello Master' })
  console.log('1');
  process.on('message', (msg) => {
    process.send('HJY' + msg)
  })
}

运行结果

1
1
2HJY wo ai ni
1HJY wo ai ni

*/


var redis = require('redis'),
    RDS_PORT = 6379,
	RDS_HOST = '127.0.0.1',
	RDS_PWD = 'wzb1558262110', //如果有设置密码
    client = redis.createClient(RDS_PORT,RDS_HOST);
	

client.on('connect',function(){
	console.log('redis已连接上');
})

//redis.print是一个redis的方法，他会打印出你设置redis的信息结果
//注意redis每个获取的和设置的方式都不一样

//https://www.cnblogs.com/harelion/p/5203710.html 这里面有Node-redis的使用方法详情

client.auth(RDS_PWD,function(){  //有密码的话需要认证才能获取或设置数据
	console.log('通过认证');
	client.set('xiaoben','hello world',redis.print);  //单单设置键值
	client.sadd('js','kankan','you');   //设置'js'键多个值
	client.get('myKey',redis.print); 	//获取单个键设置的单个值
	
	client.multi()  //执行多个方法
	.smembers('js',function(err,data){  //获取单个键的多个值
		console.log(data);
	})
	.sismember('js','kankan',redis.print) //获取单个键里有多个value时的某个value存在返回1，不存在返回0
	.hget('hjy', 'js', function (err, getRslt) { //获取键里键的值
             if(err) {
                 console.log(err);
             }else {
                 console.log('js:', getRslt);
                 
            }
   })
	.exec(function(err,replies){  //接受多个方法里返回的数据
		console.log(replies);
	});
});

client.on('ready',function(err){
	console.log('redis配置成功');
});

setTimeout(function(){
	client.hmset('hjy',{'js':"javascript",'node':"node-redis"},redis.print);  //设置'hjy'键存储多个键值
    client.hgetall('hjy',function(err,data){ //获取键里面所有的键值
	   if(err) {
		   console.log('Error:' + err);
		   return;
	   } 
	   console.log(data);
	});
	  client.rpush("003", [1, 2, 3, 4, 5], function(err, res) { //往'003'键里增添数据
		  console.log(res);  //长度
	  });
},2000);












