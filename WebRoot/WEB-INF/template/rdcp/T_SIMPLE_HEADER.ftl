<html>
<head>
    <title>${property(cxt,"title")}</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <base href="${cxt.objects.request.scheme}://${cxt.objects.request.serverName}:${cxt.objects.request.serverPort}${cxt.objects.request.contextPath}/">
    <link href="themes/default/css/sunrise.css" rel="stylesheet" type="text/css"/>
    <link href="themes/default/css/lhgdialog.css" rel="stylesheet" type="text/css"/>
    <link href="themes/default/css/framework.css" rel="stylesheet" type="text/css"/>
    <link href="themes/default/css/jquery.loading.css" rel="stylesheet" type="text/css"/>
    <link href="themes/default/css/sunriseGrid.css" rel="stylesheet" type="text/css"/>
    <script type="text/javascript" src="scripts/sunrise/framework.js"></script>
    <script type="text/javascript" src="scripts/sunrise/common.js"></script>

    <style>
        .ui-autocomplete-loading {
            background: white url('themes/default/images/ui-anim_basic_16x16.gif') right center no-repeat;
        }

        #city {
            width: 25em;
        }

        .loading-indicator-bars {
            background-image: url('themes/default/images/loading-bars.gif');
            width: 150px;
        }
    </style>
</head>
<body>