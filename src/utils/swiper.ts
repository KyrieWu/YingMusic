import { Ref } from 'vue'

/**
 * Generate the rotaty-cast image effect
 */


interface SwiperInfo {
    swipe: Ref;
    swipe_bg: Ref;
    swipe_img_box: Ref;
    swipe_link: Ref;
    swipe_img: Ref;
    swipe_select: Ref;
    swipe_btn_left: Ref;
    swipe_btn_right: Ref;
}

export class Swiper {
    swipe: Ref;
    swipe_bg: Ref;
    swipe_img_box: Ref;
    swipe_link: Ref;
    swipe_img: Ref;
    swipe_select: Ref;
    swipe_btn_left: Ref;
    swipe_btn_right: Ref;
    current_index: number;
    swipe_timer: NodeJS.Timer | null;
    links: BannerInfo[];
    constructor(options: SwiperInfo) {
        this.swipe = options.swipe;
        this.swipe_bg = options.swipe_bg;
        this.swipe_img_box = options.swipe_img_box;
        this.swipe_link = options.swipe_link;
        this.swipe_img = options.swipe_img;
        this.swipe_select = options.swipe_select;
        this.swipe_btn_left = options.swipe_btn_left;
        this.swipe_btn_right = options.swipe_btn_right;
        this.current_index = -1;
        this.swipe_timer = null
        this.links = [];
    }

    initData(data: BannerInfo[]): void {
        this.links = data
        for (let i = 0; i < this.links.length; i++) {
            let item = document.createElement("a");
            item.setAttribute("class", "item");
            //item.setAttribute("href", "#");
            item.setAttribute("data-index", String(i));
            item.style.display = "inline-block";
            item.style.width = "10px";
            item.style.height = "10px";
            item.style.backgroundColor = "#fff";
            item.style.margin = "0 10px";
            item.style.borderRadius = "50%";
            item.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 10.4)";

            this.swipe_select.value.appendChild(item);
        }

        this.select(0);
        this.bind();
        this.play();
    };

    select(index: any): void {
        index = Number(index);
        if (index >= this.links.length) {
            return;
        }
        if (this.current_index == index) {
            return;
        }

        if (this.current_index > -1) {
            this.swipe_select.value.children[this.current_index].style.backgroundColor = "#fff";
        }

        this.current_index = index;
        let current_link = this.links[this.current_index];
        this.swipe_bg.value.style.backgroundImage = "url(" + current_link.imageUrl + ")";
        this.swipe_img.value.setAttribute("src", current_link.imageUrl);
        if (current_link.url !== null) {
            this.swipe_link.value.setAttribute("href", current_link.url);
        }

        if (current_link.url !== null) {
            this.swipe_link.value.setAttribute("target", '_blank')
        } else {
            this.swipe_link.value.removeAttribute("target", '_blank')
        }
        this.swipe_select.value.children[this.current_index].style.backgroundColor = "#ff4400";
    };

    autoSelect(index: any): void {
        index = Number(index);
        if (index >= this.links.length) {
            return;
        }
        if (this.current_index == index) {
            return;
        }

        if (this.current_index > -1) {

            this.swipe_select.value.children[this.current_index].style.backgroundColor = "#fff";

        }

        this.current_index = index;
        let current_link = this.links[this.current_index];
        this.swipe_bg.value.style.backgroundImage = "url(" + current_link.imageUrl + ")";
        this.swipe_img.value.style.transition = "opacity 0.5s ease-in 0s";
        this.swipe_img.value.style.opacity = 0.2;

        this.swipe_img.value.setAttribute("src", current_link.imageUrl);
        if (current_link.url != null) {
            this.swipe_link.value.setAttribute("href", current_link.url);
        }

        if (current_link.url !== null) {
            this.swipe_link.value.setAttribute("target", '_blank')
        } else {
            this.swipe_link.value.removeAttribute("target", '_blank')
        }
        //this.swipe_img.value.style.transition = "opacity 0.7s ease-out 0s";
        this.swipe_img.value.style.opacity = 1;

        if (!document.querySelector(".swipe .checked")) {
            this.swipe_select.value.children[this.current_index].style.transition =
                "background-color 0.5s";
            this.swipe_select.value.children[this.current_index].style.backgroundColor =
                "#ff4400";
        }
    };

    play(): void {
        this.swipe_timer = setInterval(() => {
            let index = this.current_index + 1;
            if (index >= this.links.length) {
                index = 0;
            }
            this.autoSelect(index);
        }, 3000);
    };

    stop(): void {
        if (this.swipe_timer) {
            clearInterval(this.swipe_timer);
            this.swipe_timer = null;
        }
    };

    bind(): void {
        this.swipe_btn_left.value.addEventListener("click", () => {
            let index = this.current_index - 1;
            if (index < 0) {
                index = this.links.length - 1;
            }

            this.select(index);
        });
        this.swipe_btn_right.value.addEventListener("click", () => {
            let index = this.current_index + 1;
            if (index >= this.links.length) {
                index = 0;
            }

            this.select(index);
        });

        for (const key in this.swipe_select.value.children) {
            if (this.swipe_select.value.children.hasOwnProperty(key)) {
                const element = this.swipe_select.value.children[key];
                element.addEventListener("click", (e: Event): void => {
                    e.preventDefault();
                    if (e !== null && e.target instanceof HTMLElement) {
                        this.select(e.target.dataset.index);
                    }
                });
            }
        }

        this.swipe.value.addEventListener("mouseover", (e: MouseEvent): void => {
            if (
                e.relatedTarget &&
                this.swipe.value.compareDocumentPosition(e.relatedTarget) == 10
            ) {
                this.stop();
            }
        });
        this.swipe.value.addEventListener("mouseout", (e: MouseEvent): void => {
            if (
                e.relatedTarget &&
                this.swipe.value.compareDocumentPosition(e.relatedTarget) == 10
            ) {
                this.play();
            }
        });
        this.swipe.value.addEventListener("mousemove", (e: MouseEvent): void => {
            this.stop();
        });
    };
}

