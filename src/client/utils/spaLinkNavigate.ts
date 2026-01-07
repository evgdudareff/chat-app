import {Router} from "./router";

export const spaLinkNavigate = (router: Router) => {
    return (event: Event) => {
        const target = event.target as HTMLAnchorElement;
        const href = target.getAttribute('href');
        if (href) {
            event.preventDefault();
            router.navigate(href);
        }
    }

}