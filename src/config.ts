
export const ANIMATION_TIMES={
    /*Header*/
    /*Desk Items*/
    HEADER_SHOW:800,
    NO_ZOOM_LITTLE_WAIT:300,
    ZOOM_IN:1200,
    ZOOM_OUT:1200,
    /*Overlay*/
    CHILD_SWITCH:500,
    
    /*Devlog*/
    DEVLOG_SLIDEIN:800,
    DEVLOG_LEAVE:500,
    BINDER_SHOW:400,
    PAGE_SHOW:300,

    /*Blog*/
    COMPUTER_OPEN:500,
    COMPUTER_CLOSE:400,
};

export type PreloadAssetType = 'image' | 'audio' | 'video' | 'font' | 'fetch' | 'page';

export interface PreloadAsset {
    type: PreloadAssetType;
    src: string;
}
/*Load resources */
export const PRELOAD_ASSETS = [
    /*image,audio,video,font,fetch,page */
    { type: 'image', src: '/Images/desk_bg_Template.png' },
    {type:'font',src:'/fonts/ArtEnglish.otf'},
    {type:'font',src:'/fonts/CursorTooltip.ttf'},

    /*Page*/
    {type:'page',src:'/'},
    {type:'page',src:'/devlog'},
    {type:'page',src:'/blog'},
    {type:'page',src:'/about'},
    {type:'page',src:'/devlog/game-001'},
];