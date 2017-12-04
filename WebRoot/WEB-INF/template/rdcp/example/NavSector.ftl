<link href="themes/default/css/public.css" rel="stylesheet" type="text/css"/>
<div id="guild">
    <div id="guildleft">
        <img src="themes/default/images/guild_r1_c1.gif"/>
    </div>
    <div id="guildcenter">
        您所在的位置：${property("navpath")!"未定义"}
    </div>
    <div id="guildright">
    <#--<img src="themes/default/images/guild_r1_c5.gif"/>-->
        <script>
            $(function() {
                var _param = ${param(".name")};
                ${property("ftlparam")!};
            });
        </script>
    </div>
</div>