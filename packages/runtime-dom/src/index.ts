import { nodeOps } from "./nodeOps";
import { patchProps } from "./patchProps";

const renderOptionDom = Object.assign({ patchProps }, nodeOps);


export { renderOptionDom };
