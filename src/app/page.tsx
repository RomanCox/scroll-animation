"use client"

import {useCallback, useLayoutEffect, useMemo, useRef, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {clsx} from "clsx";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useLenis} from "lenis/react";

import {ImageContainer} from "@/components/ImageContainer";

import {projectData, projectLinksData} from "@/constants/main";

import type {IProjectLink, SlideType} from "@/constants/main";

import styles from "./page.module.scss";

export default function Home() {
    const [chapter, setChapter] = useState<SlideType>(projectData.otherSlides[0].title);

    const slides = useMemo(() =>
            projectData.otherSlides.filter(slide => slide.title === chapter),
        [chapter, projectData.otherSlides]
    );

    const newProjectLink: IProjectLink = {
        image: projectData.mainSlide.image,
        title: projectData.label,
        position: "center",
        slug: "#"
    };

    const projectLinks = [
        projectLinksData[0],
        newProjectLink,
        ...projectLinksData.slice(1)
    ];

    const imageContainerRef = useRef<HTMLDivElement>(null);
    const descriptionMainSlideRef = useRef<HTMLDivElement>(null);
    const titleBlockRef = useRef<HTMLDivElement>(null);
    const filtersBlockRef = useRef<HTMLDivElement>(null);
    const mainImageRef = useRef<HTMLImageElement>(null);
    const mainSlideRef = useRef<HTMLImageElement>(null);

    const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

    const setSlideRef = (index: number) => (el: HTMLDivElement | null) => {
        slideRefs.current[index] = el;
    };

    if (typeof window !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    const lenis = useLenis();

    const onChooseChapter = useCallback((chapter: SlideType) => {
        lenis?.scrollTo("#firstSlide", {offset: 0, lerp: 0.05});

        setChapter(chapter);
    }, [lenis]);

    useLayoutEffect(() => {
        if (
            imageContainerRef.current &&
            descriptionMainSlideRef.current &&
            filtersBlockRef.current &&
            titleBlockRef.current &&
            mainImageRef.current &&
            mainSlideRef.current
        ) {

            gsap.to(descriptionMainSlideRef.current, {
                scrollTrigger: {
                    trigger: mainSlideRef.current,
                    start: "top top",
                    end: "bottom center",
                    scrub: true,
                },
                opacity: 0,
            });

            gsap.to(titleBlockRef.current, {
                scrollTrigger: {
                    trigger: mainSlideRef.current,
                    start: "bottom center",
                    end: "bottom top",
                    scrub: true,
                },
                opacity: 1,
            });

            gsap.to(filtersBlockRef.current, {
                scrollTrigger: {
                    trigger: mainSlideRef.current,
                    start: "bottom center",
                    end: "bottom top",
                    scrub: true,
                },
                opacity: 1,
            });

            gsap.fromTo(
                imageContainerRef.current,
                { width: "100dvw" },
                {
                    scrollTrigger: {
                        trigger: mainSlideRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: true,
                    },
                    width: "68vw",
                    height: "calc(100dvh - 19.7rem)",
                    right: "3.7rem",
                    top: "16rem",
                    borderRadius: "2rem",
                }
            );

            gsap.to(mainImageRef.current, {
                scrollTrigger: {
                    trigger: mainSlideRef.current,
                    start: "top top",
                    end: "bottom center",
                    scrub: true,
                },
                opacity: 0,
            });
        }
    }, [projectData.otherSlides]);

    return (
        <main className={styles.main}>
            <section
                className={styles.sectionWrapper}
            >
                <div className={styles.animationContentContainer}>
                    <div className={styles.stickyBlock}>
                        <div className={styles.imagesWrapper} ref={imageContainerRef}>
                            <Image
                                src={projectData.mainSlide.image}
                                alt={"project image"}
                                className={styles.mainSlide}
                                ref={mainImageRef}
                                priority
                            />

                            {slides.map((slide, index) => (
                                <ImageContainer
                                    key={index}
                                    imageContainerRef={imageContainerRef}
                                    mainSlideRef={mainSlideRef}
                                    slideRefs={slideRefs}
                                    slide={slide}
                                    index={index}
                                />
                            ))}
                        </div>

                        <div className={styles.descriptionMainSlide} ref={descriptionMainSlideRef}>
                            <Image className={styles.title} src={projectData.title} alt={"заголовок"}/>
                            <div className={styles.divider}/>
                            <div className={styles.descriptionsWrapper}>
                                {projectData.mainSlide.description.map(item => (
                                    <div key={item.label} className={styles.descriptionContainer}>
                                        <p className={styles.label}>{item.label}</p>
                                        {Array.isArray(item.value) ? (
                                            <div className={styles.valuesContainer}>
                                                {item.value.map(value => (
                                                    <p key={value} className={styles.value}>{value}</p>
                                                ))}
                                            </div>
                                        ) : (<p className={styles.value}>{item.value}</p>)}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.backButtonAndTitleBlock} ref={titleBlockRef}>
                            <Link href={"/projects"} className={styles.backButton}>
                                Вернуться в проекты
                            </Link>
                            <Image className={styles.imageTitle} src={projectData.title} alt={"заголовок"}/>
                        </div>

                        <div className={styles.filtersBlock} ref={filtersBlockRef}>
                            {projectData.slideTypes.map(filter => (
                                <div
                                    key={filter}
                                    className={clsx(styles.filter, {[styles.activeFilter]: chapter === filter})}
                                    onClick={() => onChooseChapter(filter)}
                                >
                                    {filter}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.slideDescriptionsContainer}>
                        <div className={styles.slideDescription} ref={mainSlideRef}/>

                        {slides.map((slide, index) => (
                            <div
                                key={index}
                                id={index === 0 ? "firstSlide" : undefined}
                                className={clsx(
                                    styles.slideDescription,
                                    {
                                        [styles.textTop]: index > 0,
                                        [styles.lastSlideDescription]: index === slides.length - 1,
                                    }
                                )}
                                ref={setSlideRef(index)}
                            >
                                {slide.description}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.projectLinksContainer}>
                    {projectLinks.map(item => (
                        <Link key={item.slug} href={item.slug}
                              className={clsx(styles.projectLink, {[styles.centerLink]: item.position === "center"})}>
                            <Image src={item.image} alt={"image"} className={styles.image}/>
                            <div className={clsx(styles.projectLinkContent, {[styles[item.position]]: true})}>
                                <p className={styles.position}>
                                    {item.position === "left" ? "предыдущий проект" :
                                        item.position === "right" ? "следующий проект" : "текущий проект"}
                                </p>
                                <div className={styles.titleContainer}>
                                    <h3 className={styles.projectLinkTitle}>{item.title}</h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
