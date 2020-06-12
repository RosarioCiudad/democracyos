import React from 'react';
import Slider from 'react-slick';
 
const slideImages = [
  'https://www.rosario.gob.ar/web/sites/default/files/galeria_actividades01.jpg',
  'https://www.rosario.gob.ar/web/sites/default/files/galeria_actividades02.jpg',
  'https://www.rosario.gob.ar/web/sites/default/files/galeria_actividades03.jpg',
  'https://www.rosario.gob.ar/web/sites/default/files/galeria_actividades04.jpg',
  'https://www.rosario.gob.ar/web/sites/default/files/galeria_actividades05.jpg',
  'https://www.rosario.gob.ar/web/sites/default/files/galeria_actividades06.jpg',
  'https://www.rosario.gob.ar/web/sites/default/files/galeria_actividades07.jpg',
  'https://www.rosario.gob.ar/web/sites/default/files/galeria_actividades08.jpg',
  'https://www.rosario.gob.ar/web/sites/default/files/galeria_actividades09.jpg',
  'https://www.rosario.gob.ar/web/sites/default/files/galeria_actividades10.jpg',
];

export default class SliderView extends React.Component{
  render() {
    var settings = {
      dots: true,
      infinite: true,
      speed: 400,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      adaptiveHeight: true,
      accessibility: true,
      autoplay: false,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            adaptiveHeight: true,
            infinite: true,
            dots: true,
            speed: 400,
            arrows: true,
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            adaptiveHeight: true,
            initialSlide: 1,
            dots: true,
            speed: 400,
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            adaptiveHeight: true,
            dots: true,
            slidesToScroll: 1
          }
        }
      ]
    };
    return (
        <Slider {...settings}>
            <div className='box-image'>
              <img className='img-responsive' src={slideImages[0]}/>
            </div>
            <div className='box-image'>
              <img className='img-responsive' src={slideImages[1]}/>
            </div>
            <div className='box-image'>
              <img className='img-responsive' src={slideImages[2]}/>
            </div>
           
        </Slider>
    );
  };
};