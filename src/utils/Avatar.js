import Util from "./Util";

export default class Avatar {
    static avatars = '🐶^🐱^🐭^🐹^🐰^🦊^🐻^🐼^🐨^🐯^🦁^🐮^🐷^🐸^🐵^🐔^🐧^🐦^🐤^🦆^🦅^🦉^🦇^🐺^🐗^🐴^🦄^🐝^🐛^🦋^🐌^🐞^🐜^🦟^🦗^🕷^🦂^🐢^🐍^🦎^🦖^🦕^🐙^🦑^🦐^🦞^🦀^🐡^🐠^🐟^🐬^🐳^🐋^🦈^🐊^🐅^🐆^🦓^🦍^🐘^🦛^🦏^🐪^🐫^🦒^🦘^🐃^🐂^🐄^🐎^🐖^🐏^🐑^🦙^🐐^🦌^🐕^🐩^🐈^🐓^🦃^🦚^🦜^🦢^🕊^🐇^🦝^🦡^🐁^🐀^🐿^🦔^🐲^🦧^🦮^🦥^🦦^🦨^🦩';
    static avatarArray = this.avatars.split('^');

    static getRandomAvatar() {
        let random = Util.getRandom(this.avatarArray.length - 1);
        return this.avatarArray[random];
    }
}
