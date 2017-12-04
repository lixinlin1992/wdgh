/**
 * @(#)ImageHandle.java 2016-06-03
 * 版权所有 (c) 2008-2016 广州市森锐电子科技有限公司
 *
 */
package com.tool;

import com.sun.image.codec.jpeg.JPEGCodec;
import com.sun.image.codec.jpeg.JPEGEncodeParam;
import com.sun.image.codec.jpeg.JPEGImageEncoder;

import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

/**
 * @author Administrator
 * @version 1.0 2016-06-03
 * @since JDK1.6
 */
public class ImageHandler {
    public static void main(String args[]){
        String filePath = "F://IMG_20130803_191923.jpg";
        File _file = new File(filePath);
        File _file2 = new File("F://2013_12_01_20_48_36.jpg");
        File[] files = {_file,_file2};
        addMarkToImg("100.198736","188.287465","2016-06-06 15:16:44",files);
    }
    public static void addMarkToImg(String longitude,String latitude,String time,File[] files){
        for(File _file : files){
            String pressText1 = "经度:" + longitude + ",纬度:" + latitude;
            String pressText2 = time;

            pressText(pressText1,_file,"font-weight",Font.ITALIC,255,50,800, 200);
            pressText(pressText2,_file,"font-weight", Font.ITALIC,255,50,500, 100);
        }
    }
    public static void pressText(String pressText, File _file,
                                 String fontName, int fontStyle, int color, int fontSize, int x,
                                 int y) {
        try {
            //File _file = new File(targetImg);
            Image src = ImageIO.read(_file);
            int wideth = src.getWidth(null);
            int height = src.getHeight(null);
            BufferedImage image = new BufferedImage(wideth, height,
                    BufferedImage.TYPE_INT_RGB);
            Graphics g = image.createGraphics();
            g.drawImage(src, 0, 0, wideth, height, null);
// String s="www.qhd.com.cn";
            g.setColor(new Color(color,false));
            g.setFont(new Font(fontName, fontStyle, fontSize));
            g.drawString(pressText, wideth - fontSize - x, height - fontSize
                    / 2 - y);
            g.dispose();
            FileOutputStream out = new FileOutputStream(_file.getAbsoluteFile());
            JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(out);
            encoder.encode(image);
            out.close();
        } catch (Exception e) {
            System.out.println(e);
        }
    }
}
