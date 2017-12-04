/**
 * Created by Guo on 2017/6/28.
 */

// swiper1
var mySwiper = new Swiper('.swiper1 .swiper-container',{
    pagination: '.swiper1 .pagination',
    loop:true,
    grabCursor: true,
    paginationClickable: true,
    autoplay: 5000
});
$('.swiper1 .arrow-left').on('click', function(e){
    e.preventDefault();
    mySwiper.swipePrev()
});
$('.swiper1 .arrow-right').on('click', function(e){
    e.preventDefault();
    mySwiper.swipeNext()
});
// swiper1

// swiper2
var mySwiper2 = new Swiper('.swiper2 .swiper-container',{
    pagination: '.swiper2 .pagination',
    loop:true,
    grabCursor: true,
    paginationClickable: true,
    autoplay: 5000
});
$('.swiper2 .arrow-left').on('click', function(e){
    e.preventDefault();
    mySwiper2.swipePrev()
});
$('.swiper2 .arrow-right').on('click', function(e){
    e.preventDefault();
    mySwiper2.swipeNext()
});
// swiper2

// swiper3
var mySwiper3 = new Swiper('.swiper3 .swiper-container',{
    pagination: '.swiper3 .pagination',
    loop:true,
    grabCursor: true,
    paginationClickable: true,
    autoplay: 5000
});
$('.swiper3 .arrow-left').on('click', function(e){
    e.preventDefault();
    mySwiper3.swipePrev()
});
$('.swiper3 .arrow-right').on('click', function(e){
    e.preventDefault();
    mySwiper3.swipeNext()
});
// swiper3

// swiper4
var mySwiper4 = new Swiper('.swiper4 .swiper-container',{
    //pagination: '.swiper4 .pagination',
    loop:true,
    grabCursor: true,
    paginationClickable: true,
    autoplay: 5000,
    slidesPerView: 7,
    slidesPerGroup: 7
});
$('.g-yqlj-left:eq(0)').on('click', function(e){
    e.preventDefault();
    mySwiper4.swipePrev()
});
$('.g-yqlj-left2').on('click', function(e){
    e.preventDefault();
    mySwiper4.swipeNext()
});
// swiper4

// swiper5
var mySwiper5 = new Swiper('.swiper5 .swiper-container',{
    //pagination: '.swiper4 .pagination',
    loop:true,
    grabCursor: true,
    paginationClickable: true,
    autoplay: 4000,
    mode: 'vertical'

});
$('.g-gonggao .arrow-left').on('click', function(e){
    e.preventDefault();
    mySwiper5.swipePrev()
});
$('.g-gonggao .arrow-right').on('click', function(e){
    e.preventDefault();
    mySwiper5.swipeNext()
});
// swiper5