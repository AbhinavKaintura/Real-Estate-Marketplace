'use client';
import { m as motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import designImage from '../../../../public/design-image.jpg';
import marketingImage from '../../../../public/marketing-image.jpg'; 
import developmentImage from '../../../../public/development-image.jpg'; 
import mediaContentImage from '../../../../public/media-content-image.jpg'; 
import { ArrowRight } from 'lucide-react';
import message from "@/../public/message.png"; 

const Services = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const textHoverVariants = {
    initial: { 
      opacity: 1,
      scale: 1
    },
    hover: { 
      opacity: 0.8,
      scale: 1.05,
      transition: { duration: 0.3 } 
    }
  };

  const imageHoverVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.02, transition: { duration: 0.3 } }
  };

  const buttonHoverVariants = {
    initial: { 
      scale: 1,
      
    },
    hover: { 
      scale: 1.05,
      
      transition: { duration: 0.2 } 
    }
  };

  const services = [
    {
      title: 'Design & Branding',
      description: 'Crafting visually compelling and memorable brand identities. From logos to complete brand guidelines, we ensure a cohesive and impactful presence across all platforms.',
      image: designImage,
      imageAlt: 'Design & Branding',
      imageSize: '3/4',
      link: '/design'
    },
    {
      title: 'Digital Marketing',
      description: 'Strategic campaigns that drive engagement and growth. We leverage SEO, social media, and performance marketing to enhance brand visibility and connect with your audience effectively.',
      image: marketingImage,
      imageAlt: 'Digital Marketing',
      imageSize: '4/3',
      link: '/marketing'
    },
    {
      title: 'Web & App Development',
      description: 'Building seamless digital experiences with innovative design and functionality. Our team creates responsive websites and intuitive mobile apps that prioritize user experience and performance.',
      image: developmentImage,
      imageAlt: 'Web & App Development',
      imageSize: '3/4',
      link: '/development'
    },
    {
      title: 'Media & Content Creation',
      description: 'Bringing stories to life through engaging visuals and impactful narratives. We specialize in photography, videography, and content strategy to elevate your brands message.',
      image: mediaContentImage,
      imageAlt: 'Media & Content Creation',
      imageSize: '4/3',
      link: '/media'
    }
  ];

  return (
    <section className="bg-white">
      <motion.h2
        initial={{ opacity: 0, y: 20}}
        animate={{ opacity: 1, y: 10 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold font-dance text-center text-green-900 mb-16 pt-24"
      >
        Our Services
      </motion.h2>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="space-y-16"
      >
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            variants={itemVariants}
            className={`flex flex-col-reverse md:flex-row ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            } min-h-[600px] items-center justify-center bg-neutral-100`}
          >
            <motion.div
              className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center space-y-6"
            >
              <motion.h3
                variants={textHoverVariants}
                initial="initial"
                whileHover="hover"
                className="text-3xl md:text-4xl font-light text-green-900 mb-4 cursor-pointer font-Inconsolata"
              >
                {service.title}
              </motion.h3>
              <motion.p
                variants={textHoverVariants}
                initial="initial"
                whileHover="hover"
                className="text-lg md:text-xl text-neutral-600 font-montserrat"
              >
                {service.description}
              </motion.p>
              <motion.div
                variants={buttonHoverVariants}
                initial="initial"
                whileHover="hover"
                className="pt-4"
              >
                <Link href={service.link}>
                  <span className="inline-block px-6 py-3 text-slate-700 rounded-md cursor-pointer">
                    Read More
                    <ArrowRight size={24} className="inline-block ml-2" />
                  </span>
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              className="w-full md:w-1/2 relative h-[400px] md:h-[600px]"
            >
              <Link href={service.link}>
                <motion.div
                  variants={imageHoverVariants}
                  initial="initial"
                  whileHover="hover"
                  className="relative w-full h-full cursor-pointer"
                >
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    quality={95}
                    priority={index === 0}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        ))}
        
      </motion.div>
      {/* <div className="w-full">
      <Image
        src={message}
        alt="message"
        className="w-full h-auto object-cover my-16"
        width={1920} 
        height={1080} 
      />
      </div> */}
    </section>
  );
};

export default Services;