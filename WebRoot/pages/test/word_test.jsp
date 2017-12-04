<%@ page import="java.io.OutputStream" %>
<%@ page import="java.io.InputStream" %>
<%@ page import="java.io.FileInputStream" %>
<%@ page import="com.sunrise.framework.core.LoginUser" %>
<%@ page import="java.util.Map" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%
    /*
    response.reset();
    response.resetBuffer();

    response.setContentType("application/msword");
    response.setHeader("Content-disposition", "filename=Test.docx");


    OutputStream os = response.getOutputStream();

    InputStream in = new FileInputStream("E:/Test.docx");

    byte[] buf = new byte[1024];

    int length = in.read(buf);
    System.out.println("========================" + length);
    while (length == buf.length) {
        os.write(buf, 0, length);

        length = in.read(buf);
    }

    if (length > 0)
        os.write(buf, 0, length);

    in.close();
    */
    //Map<String, LoginUser> loginUsers = LoginUserSession.getSessionUsers();
    Map<String, HttpSession> loginSessions = LoginUserSession.getUserSession(60l, null);
%>


<%
//    for (LoginUser u : loginUsers.values()) {
//        out.println(u.getId() + "," + u.getName());
//        out.println();
//    }
//    out.println("-----------------");

    for (HttpSession s : loginSessions.values()) {
        out.println(s.getId());

        LoginUserSession.userLogout(s);
    }
%>

