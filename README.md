开启redis服务

redis-server.exe 在redis目录下执行出现图形和redis信息就说明开启成功了

查看redis信息（这是直接打开redis-cli.exe就会出现控制台了，输入命令即可查询）

config set requirepass 密码  （设置密码，这个设置如果控制台关闭时密码会自动为空，需要在Redis.conf文件方可设置永久）

atuh 密码 (密码认证)

config get requirepass  查看密码（如果设置密码需要认证才可使用该命令）


可视化工具（Redis Desktop）

redis v.2.2-2.8版本的最好安装 Redis Desktop v0.8.8.384版本的，不然打开redis键表时会出现版本问题：scan commands not supported by redis-server
