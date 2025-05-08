import React from "react";
import { Typography, Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import "swiper/css";
import { Navigation } from "swiper/modules";

const carouselItems = [
  {
    image:
      "https://cdn.pixabay.com/photo/2020/12/10/20/40/color-5821297_1280.jpg",
    title: "Explore Our Classroom",
    description: "Engaging and inspiring environments for every student",
  },
  {
    image:
      "https://cdn.pixabay.com/photo/2017/10/10/00/03/child-2835430_1280.jpg",
    title: "Empowering Students",
    description: "We believe in the potential of every child",
  },
  {
    image:
      "https://cdn.pixabay.com/photo/2019/09/03/01/51/child-4448370_1280.jpg",
    title: "Learning Tools",
    description: "Providing the best resources for our students",
  },
];

export default function Carousel() {
  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        rewind={true}
        navigation={true}
        modules={[Navigation]}
      >
        {carouselItems.map((item, index) => (
          <SwiperSlide key={index}>
            <Box sx={{ textAlign: "center", color: "white" }}>
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: "100%",
                  height: "70vh",
                  minHeight: "400px",
                  objectFit: "cover",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 20,
                  left: "50%",
                  transform: "translateX(-50%)",
                  bgcolor: "rgba(0, 0, 0, 0.6)",
                  padding: "10px 20px",
                  borderRadius: 1,
                }}
              >
                <Typography variant="h5">{item.title}</Typography>
                <Typography variant="body1">{item.description}</Typography>
              </Box>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
