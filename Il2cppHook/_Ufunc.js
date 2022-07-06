(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../utils/common");
/**
 * 读取 TMP_TEXT 字符串
 * @param {Number} mPtr TMP_TEXT INSTANCE
 */
var readTMPText = (mPtr) => {
    mPtr = (0, common_1.PTR2NativePtr)(mPtr);
    if (mPtr.isNull())
        return "";
    return "";
    // return callFunctionRUS(find_method("Unity.TextMeshPro", "TMP_Text", "get_text", 0), mPtr)
};
},{"../utils/common":132}],3:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.find_method = exports.HookerBase = void 0;
const decorator_cache_getter_1 = require("decorator-cache-getter");
require("../bridge/fix/Il2cppClass");
const il2cppMethod_1 = require("../bridge/fix/il2cppMethod");
const alloc_1 = require("../utils/alloc");
const enum_1 = require("./enum");
const formart_1 = require("../utils/formart");
class HookerBase {
    constructor() { }
    static get _list_assemblies() {
        return Il2Cpp.Domain.assemblies;
    }
    static get _list_assemblies_names() {
        return HookerBase._list_assemblies.map(item => item.name);
    }
    static get _list_images() {
        return HookerBase._list_assemblies.map((assembly) => assembly.image);
    }
    static get _list_images_pointers() {
        return HookerBase._list_images.map(item => item.handle);
    }
    static get _list_images_names() {
        return HookerBase._list_assemblies.map((assembly) => assembly.image.name.split(".dll")[0]);
    }
    // @cache
    static getMapImagesCacheMap = new Map();
    static getMapImages() {
        if (HookerBase.getMapImagesCacheMap.size != 0)
            return HookerBase.getMapImagesCacheMap;
        HookerBase._list_images_names.forEach((item, index) => HookerBase.getMapImagesCacheMap.set(item, HookerBase._list_images_pointers[index]));
        return HookerBase.getMapImagesCacheMap;
    }
    static get _list_classes() {
        return Il2Cpp.Domain.assemblies.map((assembly) => assembly.image).flatMap((image) => image.classes);
    }
    static showImages(filter = "", sort = true) {
        formart_1.formartClass.printTitile("List Images { assembly -> image -> classCount -> imageName }");
        HookerBase._list_images.filter((image) => {
            return filter != "" ? image.name.indexOf(filter) != -1 : true;
        }).sort((first, secend) => {
            return sort ? (first.name.toLowerCase().charAt(0) > secend.name.toLowerCase().charAt(0) ? 1 : -1) : 0;
        }).forEach((image) => {
            LOGD(`[*] ${image.assembly.handle} -> ${image.handle}\t${image.classCount}\t${image.assembly.name}`);
        });
        if (filter == "") {
            LOGO(getLine(28));
            LOGE(`  List ${HookerBase._list_images.length} Images`);
        }
        LOGO(getLine(85));
    }
    static showClasses(imageOrName, filterNameSpace = "", filterClassName = "") {
        let image;
        if (typeof imageOrName == "string") {
            image = Il2Cpp.Domain.assembly(imageOrName).image;
        }
        else if (typeof imageOrName == "number") {
            image = new Il2Cpp.Image(ptr(imageOrName));
        }
        else if (arguments[0] == undefined) {
            LOGE("imageOrName can not be null");
            return;
        }
        else {
            LOGE("imageOrName must be string or number");
            return;
        }
        let tMap = new Map();
        let countNameSpace = 0;
        let countFilterCls = 0;
        for (let i = 0; i < image.classes.length; i++) {
            let key = "[*] " + image.classes[i].namespace;
            if (tMap.get(key) == undefined) {
                tMap.set(key, new Array());
            }
            tMap.get(key)?.push(image.classes[i]);
        }
        let titleLen = formart_1.formartClass.printTitile("List Classes { namespace {classPtr->filedsCount->methodsCount->enumClass->className} }");
        for (let key of tMap.keys()) {
            let nameSpace = key;
            if (nameSpace != undefined) {
                let array = tMap.get(nameSpace);
                // filterNameSpace 不区分大小写
                if (nameSpace.toLowerCase().indexOf(filterNameSpace.toLowerCase()) == -1)
                    continue;
                ++countNameSpace;
                LOGD(`\n${nameSpace}`);
                array?.forEach((klass) => {
                    // filterClassName 不区分大小写
                    if (klass.name.toLowerCase().indexOf(filterClassName.toLowerCase()) != -1) {
                        ++countFilterCls;
                        LOGD(`\t[-] ${klass.handle} (F:${klass.fields.length}/M:${klass.methods.length}/E:${Number(klass.isEnum)})\t${klass.name}`);
                    }
                });
            }
        }
        LOGO("\n" + getLine(28));
        if (filterNameSpace == "" && filterClassName == "") {
            LOGE(`List ${image.classCount} Classes | Group by ${countNameSpace} NameSpaces`);
        }
        else {
            LOGE(`ALl ${image.classCount} Classes | List ${countFilterCls} Classes | Group by ${countNameSpace} NameSpaces`);
        }
        LOGO(getLine(titleLen));
    }
    static checkType(mPtr) {
        let klass;
        if (mPtr instanceof NativePointer) {
            klass = new Il2Cpp.Class(mPtr);
        }
        else if (typeof mPtr == "string") {
            klass = new Il2Cpp.Class(findClass(mPtr));
        }
        else if (typeof mPtr == "number") {
            klass = new Il2Cpp.Class(ptr(mPtr));
        }
        else {
            throw ("mPtr must be string or number or NativePointer");
        }
        if (klass.handle.equals(ptr(0)))
            throw ("klass handle can not be null");
        return klass;
    }
    static showMethods(mPtr) {
        let klass = HookerBase.checkType(mPtr);
        if (klass.methods.length == 0)
            return;
        formart_1.formartClass.printTitile(`Found ${klass.fields.length} Fields ${klass.isEnum ? "(enum)" : ""} in class: ${klass.name} (${klass.handle})`);
        klass.methods.forEach((method) => {
            LOGD(`[*] ${method.toString()}`);
        });
    }
    static showFields(mPtr) {
        let klass = HookerBase.checkType(mPtr);
        if (klass.fields.length == 0)
            return;
        formart_1.formartClass.printTitile(`Found ${klass.fields.length} Fields ${klass.isEnum ? "(enum) " : ""}in class: ${klass.name} (${klass.handle})`);
        klass.fields.forEach((field) => {
            LOGD(`[*] ${field.handle} ${field.type.name} ${field.toString()} [type:${field.type.class.handle}]`);
        });
        LOGO(``);
    }
    /** 优先从fromAssebly列表中去查找，找不到再查找其他Assebly */
    static map_cache_class = new Map();
    static findClass(searchClassName, fromAssebly = ["Assembly-CSharp", "MaxSdk.Scripts", "mscorlib"]) {
        if (searchClassName == undefined)
            throw ("Search name can not be null or undefined");
        if (typeof searchClassName != "string")
            throw ("findClass need a string value");
        let cache = HookerBase.map_cache_class.get(searchClassName);
        if (cache != undefined)
            return cache.handle;
        let assemblies = Il2Cpp.Domain.assemblies;
        for (let index = 0; index < assemblies.length; index++) {
            if (fromAssebly.includes(assemblies[index].name)) {
                let ret = innerCall(assemblies[index].image.classes);
                if (ret != undefined)
                    return ret.handle;
            }
        }
        for (let index = 0; index < assemblies.length; index++) {
            if (!fromAssebly.includes(assemblies[index].name)) {
                let ret = innerCall(assemblies[index].image.classes);
                if (ret != undefined)
                    return ret.handle;
            }
        }
        function innerCall(kclasses) {
            for (let index = 0; index < kclasses.length; index++)
                if (kclasses[index].name == searchClassName) {
                    HookerBase.map_cache_class.set(searchClassName, kclasses[index]);
                    return kclasses[index];
                }
        }
        return ptr(0);
    }
    /**
     * using example:
     *
     * findMethod("UnityEngine.CoreModule","UnityEngine.Transform","Rotate",2,["UnityEngine.Vector3","System.Single"]) // 最快 带参数重载
     * findMethod("UnityEngine.CoreModule","UnityEngine.Color","GetHashCode",0)  //最快 注意第二个参数全称
     * findMethod("GetHashCode","Color") functionName ClassName(简称)
     * findMethod("LerpUnclamped") // 最慢
     *
     * @param assemblyName  Assembly 名称
     * @param className     类名称(全称)
     * @param methodName    函数名称
     * @param argsCount     函数参数个数
     * @param overload      函数重载(字符串数组[全称])
     * @param cmdCall       是否是命令行调用(控制是返回值还是打印日志)
     */
    static findMethodNew(assemblyName, className, methodName, argsCount = -1, overload = [], cmdCall = true) {
        let methodInfo;
        if (arguments[3] != undefined && typeof arguments[3] == "number") {
            try {
                methodInfo = Il2Cpp.Domain.assembly(assemblyName).image.class(className).method(methodName, argsCount);
                if (overload.length != 0)
                    methodInfo = methodInfo?.overload(...overload);
            }
            catch {
                throw new Error(`findMethod failed: Not Found ${methodName}(argCount:${argsCount}) in ${className}`);
            }
        }
        else if (arguments[1] != undefined) {
            methodInfo = new Il2Cpp.Class(findClass(arguments[1])).method(arguments[0], arguments[2]);
        }
        else if (arguments[0] != undefined && arguments[1] == undefined) {
            for (let i = 0; i < HookerBase._list_classes.length; i++) {
                for (let m = 0; m < HookerBase._list_classes[i].methods.length; m++) {
                    if (HookerBase._list_classes[i].methods[m] == arguments[0]) {
                        methodInfo = HookerBase._list_classes[i].methods[m];
                        break;
                    }
                }
            }
        }
        if (methodInfo == undefined)
            throw new Error("Method not found");
        if (cmdCall) {
            showMethodInfo(methodInfo.handle);
        }
        else {
            return methodInfo;
        }
    }
    /**
     *  根据 ImageName , ClassName , functionName , argsCount 找到对应 function 的地址
     *  最后一个参数 isRealAddr 用作显示静态分析地址还是当前内存地址（带这个参数则只返回地址，不带则列表信息）
     *  find_method("UnityEngine.UI","Text","get_text",0)
     *  find_method("UnityEngine.UI","Text","get_text",0,false)
     * @param {String} imageName
     * @param {String} className
     * @param {String} functionName
     * @param {Number} argsCount
     * @param {Boolean} isRealAddr
     */
    static findMethodsyncCacheMap = new Map();
    static findMethodSync(imageName, className, functionName, argsCount = -1, isRealAddr = true, cmdCall = true) {
        if (imageName == undefined || className == undefined || functionName == undefined)
            return ptr(0);
        // var corlib = il2cpp_get_corlib()
        const soAddr = Il2Cpp.module.base;
        let cacheKey = imageName + "." + className + "." + functionName + "." + argsCount;
        if (isRealAddr) {
            let cachedPointer = HookerBase.findMethodsyncCacheMap.get(cacheKey);
            if (cachedPointer != undefined)
                return cachedPointer;
        }
        let currentlibPack = Il2Cpp.Domain.assembly(imageName).image;
        let currentlib = currentlibPack.handle;
        let klass = Il2Cpp.Api._classFromName(currentlib, (0, alloc_1.allocCStr)(imageName), (0, alloc_1.allocCStr)(className));
        if (klass.isNull()) {
            for (let j = 0; j < Il2Cpp.Api._imageGetClassCount(currentlib); j++) {
                let il2CppClass = new Il2Cpp.Class(Il2Cpp.Api._imageGetClass(currentlib, j));
                if (il2CppClass.name == className) {
                    klass = il2CppClass.handle;
                    break;
                }
            }
        }
        if (klass.isNull())
            return ptr(0);
        let method = Il2Cpp.Api._classGetMethodFromName(klass, (0, alloc_1.allocCStr)(functionName), argsCount);
        if (method.isNull())
            return ptr(0);
        if (arguments[5] != undefined && arguments[5] != 2) {
            return method;
        }
        else if (arguments[5] != undefined && arguments[5] == 2) {
            return method.readPointer().sub(soAddr);
        }
        HookerBase.findMethodsyncCacheMap.set(cacheKey, method.readPointer());
        if (isRealAddr)
            return isRealAddr ? method.readPointer() : method.readPointer().sub(soAddr);
        let il2cppMethod = new Il2Cpp.Method(method);
        let parameters_count = il2cppMethod.parameterCount;
        let arr_args = new Array();
        let arr_args_type_addr = new Array();
        for (let i = 0; i < parameters_count; i++) {
            let currentParamter = il2cppMethod.parameters[i];
            let typeClass = currentParamter.type.class.handle;
            let TypeName = currentParamter.type.class.name;
            arr_args.push(TypeName + " " + currentParamter.name);
            arr_args_type_addr.push(TypeName + " " + typeClass);
        }
        let disStr = (0, il2cppMethod_1.getMethodModifier)(method) + il2cppMethod.returnType.name + " " +
            il2cppMethod.name + " " +
            "(" + arr_args + ")" + "\t";
        LOGO(getLine(85));
        LOG(imageName + "." + className + "\t" + disStr, enum_1.LogColor.RED);
        LOGO(getLine(30));
        let ShowMore = false;
        LOG("Il2CppImage\t---->\t" + currentlib + (ShowMore ? " (" + currentlib.add(p_size).readPointer().readCString() + ")" : ""));
        LOG("Il2CppClass\t---->\t" + klass + (ShowMore ? " (" + Il2Cpp.Api._classGetName(klass) + ")" : ""));
        LOG("MethodInfo\t---->\t" + method + (ShowMore ? " (" + Il2Cpp.Api._classGetName(method) + ")" : ""));
        LOGD("methodPointer\t---->\t" + method.readPointer() + "\t===>\t" + method.readPointer().sub(soAddr));
        LOGO(getLine(85));
    }
}
__decorate([
    decorator_cache_getter_1.cache
], HookerBase, "_list_assemblies", null);
__decorate([
    decorator_cache_getter_1.cache
], HookerBase, "_list_assemblies_names", null);
__decorate([
    decorator_cache_getter_1.cache
], HookerBase, "_list_images", null);
__decorate([
    decorator_cache_getter_1.cache
], HookerBase, "_list_images_pointers", null);
__decorate([
    decorator_cache_getter_1.cache
], HookerBase, "_list_images_names", null);
__decorate([
    decorator_cache_getter_1.cache
], HookerBase, "_list_classes", null);
exports.HookerBase = HookerBase;
const find_method = HookerBase.findMethodSync;
exports.find_method = find_method;
Reflect.set(globalThis, "Hooker", HookerBase);
globalThis.i = HookerBase.showImages;
globalThis.c = HookerBase.showClasses;
globalThis.m = HookerBase.showMethods;
globalThis.f = HookerBase.showFields;
globalThis.fc = HookerBase.findClass;
globalThis.findClass = HookerBase.findClass;
globalThis.findMethod = HookerBase.findMethodNew;
globalThis.find_method = HookerBase.findMethodSync;
globalThis.af = (className) => B(findClass(className));
globalThis.aui = () => B("AUI");
Il2Cpp.perform(() => globalThis.soAddr = Il2Cpp.module.base);
},{"../bridge/fix/Il2cppClass":10,"../bridge/fix/il2cppMethod":12,"../utils/alloc":128,"../utils/formart":134,"./enum":5,"decorator-cache-getter":139}],4:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Breaker = void 0;
const fastest_levenshtein_1 = require("fastest-levenshtein");
const il2cppMethod_1 = require("../bridge/fix/il2cppMethod");
const formart_1 = require("../utils/formart");
const base_1 = require("./base");
const valueResolve_1 = __importDefault(require("./valueResolve"));
class Breaker {
    static maxCallTimes = 10; // 出现 ${maxCallTimes} 次后不再显示
    static detachTimes = 500; // 出现 ${detachTimes} 次后取消 hook
    static map_attachedMethodInfos = new Map();
    static map_methodInfo_callTimes = new Map();
    static array_methodInfo_detached = new Array();
    static array_attach_failed = new Array();
    static array_methodValue_cache = new Array(); // 日志相关,记录参数
    // private static array_log_cache: Map<string, [string, NativePointer[], NativePointer]> = new Map()
    static addBreakPoint(imgOrClsPtr = "CommonClass") {
        if (imgOrClsPtr instanceof NativePointer) {
            innerImage(imgOrClsPtr);
        }
        else if (typeof imgOrClsPtr == "number") {
            innerImage(ptr(imgOrClsPtr));
        }
        else if (typeof imgOrClsPtr == "string") {
            if (imgOrClsPtr == "CommonClass" || imgOrClsPtr == "JNI" || imgOrClsPtr == "Soon")
                return checkSpecialClass(imgOrClsPtr);
            // is ImageName or className
            if (base_1.HookerBase._list_images_names.toString().includes(imgOrClsPtr)) { // is ImageName.dll / assemblyName
                // ImageName
                base_1.HookerBase._list_images.forEach((image) => {
                    if (image.name.includes(imgOrClsPtr)) {
                        formart_1.formartClass.printTitile("Found : ImageName: " + imgOrClsPtr + " at " + image.handle);
                        innerImage(image.handle);
                    }
                });
            }
            else {
                // className
                let clsPtr = findClass(imgOrClsPtr);
                if (!clsPtr.isNull()) {
                    formart_1.formartClass.printTitile("Found : ClassName: " + imgOrClsPtr + " at " + clsPtr);
                    innerImage(clsPtr);
                }
                else {
                    let imageName = (0, fastest_levenshtein_1.closest)(imgOrClsPtr, base_1.HookerBase._list_images_names);
                    LOGE(`You mean this ? ${imageName} @ ${Il2Cpp.Domain.assemblies.filter(item => item.name.includes)[0].handle}`);
                }
            }
        }
        function innerImage(imgOrClsPtr) {
            let lastSize = Breaker.map_attachedMethodInfos.size;
            if (imgOrClsPtr.isNull())
                throw new Error("can't attach nullptr");
            if (base_1.HookerBase._list_images_pointers.map(item => Number(item)).includes(Number(imgOrClsPtr))) {
                let imageHandle = imgOrClsPtr;
                new Il2Cpp.Image(imageHandle).classes
                    .flatMap(cls => cls.methods)
                    .forEach(Breaker.attachMethod);
            }
            else {
                let classHandle = imgOrClsPtr;
                new Il2Cpp.Class(classHandle).methods
                    .forEach(Breaker.attachMethod);
            }
            LOGO(`${getLine(40, "-")}\n Attached ${Breaker.map_attachedMethodInfos.size - lastSize} methods / All ${Breaker.map_attachedMethodInfos.size} methods\n${getLine(85, "-")}`);
        }
        function checkSpecialClass(type) {
            if (type == "CommonClass") {
                let CommonClass = ["Assembly-CSharp", "MaxSdk.Scripts", "Game", "Zenject", "UniRx", "Purchasing.Common", "UnityEngine.Purchasing"];
                base_1.HookerBase._list_images.forEach((image) => {
                    if (CommonClass.includes(image.assembly.name)) {
                        formart_1.formartClass.printTitile("Found : ImageName: " + image.name + " at " + image.handle);
                        innerImage(image.handle);
                    }
                });
            }
            else if (type == "JNI") {
                let clsTmp = Il2Cpp.Domain.assembly("UnityEngine.AndroidJNIModule").image.class("UnityEngine.AndroidJNI");
                if (clsTmp.isNull())
                    throw new Error("can't find class UnityEngine.AndroidJNI");
                formart_1.formartClass.printTitile("Found : ClassName: " + clsTmp.name + " at " + clsTmp.handle);
                innerImage(clsTmp.handle);
                // innerImage(Il2Cpp.Domain.assembly("UnityEngine.AndroidJNIModule").image.class("UnityEngine.AndroidJNIHelper").handle)
            }
            else if ("AUI") {
                innerImage(Il2Cpp.Domain.assembly("Assembly-CSharp").image.handle);
                setTimeout(() => h("Update"), 3000);
            }
            else if (type == "Soon") {
                //todo others
            }
            else {
                throw new Error("checkSpecialClass : type error");
            }
        }
    }
    static attachMethod(method) {
        attachMethodInner(method);
        function attachMethodInner(method, filterModifier = "all") {
            if (filterModifier == "all") {
                if (!(0, il2cppMethod_1.getMethodModifier)(method).includes("abstract") && !method.virtualAddress.isNull())
                    Breaker.attachMethodInfo(method);
            }
            else {
                if (!(0, il2cppMethod_1.getMethodModifier)(method).includes(filterModifier))
                    return;
                if (!method.virtualAddress.isNull())
                    Breaker.attachMethodInfo(method);
            }
        }
    }
    static callTimesInline = 0;
    static attachMethodInfo(method, moreInfo = false) {
        if (method.virtualAddress.isNull()) {
            LOGE((0, il2cppMethod_1.methodToString)(method));
            return;
        }
        if (Breaker.map_attachedMethodInfos.has(method))
            return;
        try {
            let handleFunc = Interceptor.attach(method.virtualAddress, {
                onEnter: function (args) {
                    if (!Breaker.needShowLOG(method, "onEnter"))
                        return;
                    if (!moreInfo) {
                        // 精简版 B() 针对单个classes/Images
                        let cacheID = `[${++Breaker.callTimesInline}|${new Date().toLocaleTimeString().split(" ")[0]}]`;
                        this.passValue = new valueResolve_1.default(cacheID, method).setArgs(args);
                        return LOGD(this.passValue.toString());
                    }
                    else {
                        // 详细版 b() 针对单个函数
                        let tmp_content = [];
                        if (!method.isStatic) {
                            // 非static方法
                            tmp_content[0] = `  inst\t| \t\t\t${args[0]}\t\t[ ${valueResolve_1.default.fakeValue(args[0], new Il2Cpp.Type(ptr(1)), method)} ] ( ${method.class.handle} )`;
                            for (let index = 1; index < method.parameterCount + 1; ++index) {
                                let start = `  arg${index}  | `;
                                let mid = `${method.parameters[index - 1].name}\t--->\t\t${formart_1.formartClass.getPtrFormart(args[index])}\t\t`;
                                let end = `${method.parameters[index - 1].type.name} (${method.parameters[index - 1].type.class.handle})`;
                                let res = `\t ${valueResolve_1.default.fakeValue(args[index], method.parameters[index - 1].type, method)}`;
                                tmp_content[tmp_content.length] = `${start}${mid}${end}${res}`;
                            }
                        }
                        else {
                            // static方法
                            for (let index = 0; index < method.parameterCount; ++index) {
                                let start = `  arg${index}  | `;
                                let mid = `${method.parameters[index].name}\t--->\t\t${formart_1.formartClass.getPtrFormart(args[index])}\t\t`;
                                let end = `${method.parameters[index].type.name} (${method.parameters[index].type.class.handle})\t `;
                                let res = `${valueResolve_1.default.fakeValue(args[index], method.parameters[index].type, method)}`;
                                tmp_content[tmp_content.length] = `${start}${mid}${end}${res}`;
                            }
                        }
                        this.content = tmp_content;
                        let classTitle = `${method.class.namespace}.${method.class.name}`;
                        let disptitle = `${classTitle} | ${(0, il2cppMethod_1.methodToString)(method, true)}\t [${method.handle} -> ${method.virtualAddress} -> ${method.relativeVirtualAddress}] | ${new Date().toLocaleTimeString().split(" ")[0]}`;
                        this.disp_title = disptitle;
                    }
                },
                onLeave: function (retval) {
                    if (!Breaker.needShowLOG(method, "onLeave"))
                        return;
                    if (!moreInfo && this.passValue != undefined) {
                        Breaker.array_methodValue_cache.push(this.passValue.setRetval(retval));
                    }
                    if (this.content == null || this.disp_title == null)
                        return;
                    let start = `  ret\t| `;
                    let mid = `\t\t\t${formart_1.formartClass.getPtrFormart(retval)}\t\t`;
                    let end = `${method.returnType.name} (${method.returnType.class.handle})\t `;
                    let res = `${new valueResolve_1.default("", method).setRetval(retval).resolve(-1)}`;
                    this.content[this.content.length] = `${start}${mid}${end}${res}`;
                    let lenMex = Math.max(...this.content.map(item => item.length), this.disp_title.length);
                    LOGO(`\n${getLine(lenMex)}`);
                    LOGD(this.disp_title);
                    LOGO(getLine(this.disp_title.length / 3));
                    this.content.forEach(LOGD);
                    LOGO(getLine(lenMex));
                }
            });
            LOGD((0, il2cppMethod_1.methodToString)(method));
            Breaker.map_attachedMethodInfos.set(method, handleFunc);
        }
        catch (error) {
            catchError(method);
        }
        function catchError(method) {
            LOGE((0, il2cppMethod_1.methodToString)(method));
            if (Process.arch == "arm") {
                let ins = method.virtualAddress.readPointer();
                if (ins != null && ins.equals(0xE12FFF1E))
                    showErrorLog(ins);
            }
            else if (Process.arch == "arm64") {
                let ins = method.virtualAddress.readPointer();
                if (ins != null && ins.equals(0xC0035FD6))
                    showErrorLog(ins);
            }
            else {
                Breaker.array_attach_failed.push(method);
                printCtx(method.relativeVirtualAddress, 1, 1, LogColor.WHITE, 1);
            }
            function showErrorLog(ins, error = "\tMethod null implementation or attach by other intercepter") {
                LOGE(`\t${method.virtualAddress} -> ${ins} -> ${ins.toMatchPattern()} `);
                LOGE(error);
            }
        }
    }
    static needShowLOG = (method, enterType = "onEnter") => {
        // LOGD("needShowLOG : " + enterType + " " + Breaker.attathing)
        if (method instanceof Il2Cpp.Method) {
            if (!Breaker.map_methodInfo_callTimes.has(method))
                Breaker.map_methodInfo_callTimes.set(method, 0);
            let times = Breaker.map_methodInfo_callTimes.get(method);
            if (times === undefined || times === null)
                times = 0;
            if (times >= Breaker.detachTimes) {
                Breaker.map_attachedMethodInfos.get(method).detach();
                Breaker.array_methodInfo_detached.push(method);
            }
            if (enterType === "onEnter")
                Breaker.map_methodInfo_callTimes.set(method, times + 1);
            return times < Breaker.maxCallTimes;
        }
        else {
            throw new Error("method must be Il2Cpp.Method");
        }
    };
    static breakWithArgs = (mPtr, argCount = 4) => {
        mPtr = checkPointer(mPtr);
        Interceptor.attach(mPtr, {
            onEnter(args) {
                LOGO("\n" + getLine(65));
                LOGH("Called from " + mPtr + " ---> " + mPtr.sub(soAddr) + "\t|  LR : " + checkCtx(getPlatformCtx(this.context)) + "\n");
                let tStr = String(args[0]);
                for (let t = 1; t < argCount; ++t)
                    tStr += "\t" + args[t];
                LOGD(tStr);
            },
            onLeave(retval) {
                LOGD("End Function return ---> " + retval);
            },
        });
    };
    static breakWithStack = (mPtr) => {
        mPtr = checkPointer(mPtr);
        Interceptor.attach(mPtr, {
            onEnter(args) {
                LOGO("\n" + getLine(65));
                LOGH("Called from " + mPtr + " ---> " + mPtr.sub(soAddr) + "\t|  LR : " + checkCtx(getPlatformCtx(this.context)) + "\n");
                PrintStackTraceN(this.context);
                LOGO("\n" + getLine(65));
            }
        });
    };
    static breakInline = (mPtr, maxCount = 20) => {
        if (maxCount == undefined)
            maxCount = 10;
        mPtr = checkPointer(mPtr);
        Interceptor.attach(mPtr, {
            onEnter(args) {
                LOGO("\n" + getLine(65));
                LOGH("Called from " + mPtr + " ---> " + mPtr.sub(soAddr) + "\n");
                LOGD(JSON.stringify(this.context));
            }
        });
    };
    static clearBreak = () => {
        d();
        Breaker.map_attachedMethodInfos.clear();
        Breaker.map_methodInfo_callTimes.clear();
        Breaker.array_methodInfo_detached = [];
    };
    static clearBreakAll = () => {
        Breaker.clearBreak();
        Breaker.array_methodValue_cache = [];
        Breaker.array_attach_failed = [];
    };
    static printDesertedMethods = (filterName = "") => {
        if (Breaker.map_methodInfo_callTimes.size == 0)
            return;
        let title = `${getLine(20)} detached methods ${getLine(20)}`;
        let countHideFunctions = 0;
        LOG(`${title}`, LogColor.C92);
        // 筛选 Breaker.map_methodInfo_callTimes 调用次数大雨 maxCallTimes 的方法
        Breaker.map_methodInfo_callTimes.forEach((value, key) => {
            if (value >= Breaker.maxCallTimes) {
                if (filterName == "" || key.name.indexOf(filterName) != -1) {
                    let arr = methodToArray(key);
                    let times = this.map_methodInfo_callTimes.get(key);
                    ++countHideFunctions;
                    LOGD(`[*] ${arr[0]} ---> ${arr[1]} ${arr[2]}\t\t${times}\t${arr[3]}`);
                }
            }
        });
        LOG(`${getLine(20)}`, LogColor.C92);
        LOGD(` ${Breaker.map_attachedMethodInfos.size} attached / ${Breaker.array_methodInfo_detached.length} detached / ${countHideFunctions} hidden`);
        LOG(getLine(title.length), LogColor.C92);
    };
    static printHistoryLog = (filterStr = "", countLogs = 50, reverse = false, detachAll = true) => {
        if (detachAll)
            D();
        // attathing = true
        if (typeof filterStr == "number") {
            countLogs = filterStr;
            filterStr = "";
        }
        let filterArray = Breaker.array_methodValue_cache
            .map((value) => value.toString())
            .filter((value) => value.includes(filterStr))
            .slice(0, countLogs);
        if (reverse)
            filterArray.reverse();
        filterArray.forEach(LOGD);
    };
}
exports.Breaker = Breaker;
globalThis.getPlatform = () => (Process.platform == "linux" && Process.pageSize == 0x4) ? "arm" : "arm64";
globalThis.getPlatformCtx = (ctx) => getPlatform() == "arm" ? ctx : ctx;
globalThis.maxCallTimes = Breaker.maxCallTimes;
globalThis.D = Breaker.clearBreak;
globalThis.DD = Breaker.clearBreakAll;
globalThis.B = Breaker.addBreakPoint;
globalThis.h = Breaker.printHistoryLog;
globalThis.b = (mPtr) => {
    if (typeof mPtr == "number")
        mPtr = ptr(mPtr);
    try {
        new Il2Cpp.Method(mPtr).name; // 用报错来判断是method指针还是一个普通的地址
        if (mPtr instanceof Il2Cpp.Method)
            return Breaker.attachMethodInfo(mPtr, true);
        Breaker.attachMethodInfo(new Il2Cpp.Method(mPtr), true);
    }
    catch (error) {
        Breaker.breakWithArgs(mPtr);
    }
};
globalThis.printDesertedMethods = Breaker.printDesertedMethods;
},{"../bridge/fix/il2cppMethod":12,"../utils/formart":134,"./base":3,"./valueResolve":8,"fastest-levenshtein":140}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADS_TYPE = exports.LogColor = exports.FieldAccess = exports.il2cppTabledefs = exports.ArrKAY = exports.MapKAY = exports.GKEY = exports.EpFunc = exports.TYPE_STR = void 0;
var TYPE_STR;
(function (TYPE_STR) {
    TYPE_STR[TYPE_STR["U_STR"] = 0] = "U_STR";
    TYPE_STR[TYPE_STR["C_STR"] = 1] = "C_STR";
})(TYPE_STR = exports.TYPE_STR || (exports.TYPE_STR = {}));
// ExportFunctions
var EpFunc;
(function (EpFunc) {
    EpFunc[EpFunc["il2cpp_get_corlib"] = 0] = "il2cpp_get_corlib";
    EpFunc[EpFunc["il2cpp_domain_get"] = 1] = "il2cpp_domain_get";
    EpFunc[EpFunc["il2cpp_domain_get_assemblies"] = 2] = "il2cpp_domain_get_assemblies";
    EpFunc[EpFunc["il2cpp_assembly_get_image"] = 3] = "il2cpp_assembly_get_image";
    EpFunc[EpFunc["il2cpp_image_get_class_count"] = 4] = "il2cpp_image_get_class_count";
    EpFunc[EpFunc["il2cpp_image_get_class"] = 5] = "il2cpp_image_get_class";
    EpFunc[EpFunc["il2cpp_class_get_methods"] = 6] = "il2cpp_class_get_methods";
    EpFunc[EpFunc["il2cpp_class_from_type"] = 7] = "il2cpp_class_from_type";
    EpFunc[EpFunc["il2cpp_class_get_type"] = 8] = "il2cpp_class_get_type";
    EpFunc[EpFunc["il2cpp_class_from_system_type"] = 9] = "il2cpp_class_from_system_type";
    EpFunc[EpFunc["il2cpp_class_from_name"] = 10] = "il2cpp_class_from_name";
    EpFunc[EpFunc["il2cpp_class_get_method_from_name"] = 11] = "il2cpp_class_get_method_from_name";
    EpFunc[EpFunc["il2cpp_string_new"] = 12] = "il2cpp_string_new";
    EpFunc[EpFunc["il2cpp_type_get_name"] = 13] = "il2cpp_type_get_name";
    EpFunc[EpFunc["il2cpp_type_get_class_or_element_class"] = 14] = "il2cpp_type_get_class_or_element_class";
    EpFunc[EpFunc["il2cpp_class_get_field_from_name"] = 15] = "il2cpp_class_get_field_from_name";
    EpFunc[EpFunc["il2cpp_class_num_fields"] = 16] = "il2cpp_class_num_fields";
    EpFunc[EpFunc["il2cpp_class_get_fields"] = 17] = "il2cpp_class_get_fields";
    EpFunc[EpFunc["il2cpp_field_static_get_value"] = 18] = "il2cpp_field_static_get_value";
    EpFunc[EpFunc["il2cpp_field_static_set_value"] = 19] = "il2cpp_field_static_set_value";
    EpFunc[EpFunc["getName"] = 20] = "getName";
    EpFunc[EpFunc["getLayer"] = 21] = "getLayer";
    EpFunc[EpFunc["getTransform"] = 22] = "getTransform";
    EpFunc[EpFunc["getParent"] = 23] = "getParent";
    EpFunc[EpFunc["getChildCount"] = 24] = "getChildCount";
    EpFunc[EpFunc["getChild"] = 25] = "getChild";
    EpFunc[EpFunc["get_pointerEnter"] = 26] = "get_pointerEnter";
    EpFunc[EpFunc["pthread_create"] = 27] = "pthread_create";
    EpFunc[EpFunc["getpid"] = 28] = "getpid";
    EpFunc[EpFunc["gettid"] = 29] = "gettid";
    EpFunc[EpFunc["sleep"] = 30] = "sleep";
    EpFunc[EpFunc["DecodeJObject"] = 31] = "DecodeJObject";
    EpFunc[EpFunc["GetDescriptor"] = 32] = "GetDescriptor";
    EpFunc[EpFunc["ArtCurrent"] = 33] = "ArtCurrent";
    EpFunc[EpFunc["newThreadCallBack"] = 34] = "newThreadCallBack";
})(EpFunc = exports.EpFunc || (exports.EpFunc = {}));
var GKEY;
(function (GKEY) {
    // 格式化展示使用到 let lastTime = 0
    // 不要LOG的时候值为false，需要时候true let LogFlag = true
    // count_method_times 数组用于记录 breakPoints 中方法出现的次数,index是基于临时变量 t_arrayAddr，而不是 arrayAddr  var count_method_times
    // 断点的函数出现次数大于 maxCallTime 即不显示 var maxCallTime = 10
    // let LshowLOG = true | let newThreadDelay = 0
    GKEY[GKEY["soName"] = 0] = "soName";
    GKEY[GKEY["soAddr"] = 1] = "soAddr";
    GKEY[GKEY["p_size"] = 2] = "p_size";
    GKEY[GKEY["lastTime"] = 3] = "lastTime";
    GKEY[GKEY["LogFlag"] = 4] = "LogFlag";
    GKEY[GKEY["count_method_times"] = 5] = "count_method_times";
    GKEY[GKEY["maxCallTime"] = 6] = "maxCallTime";
    GKEY[GKEY["LshowLOG"] = 7] = "LshowLOG";
    GKEY[GKEY["newThreadDelay"] = 8] = "newThreadDelay";
    GKEY[GKEY["frida_env"] = 9] = "frida_env";
})(GKEY = exports.GKEY || (exports.GKEY = {}));
// map key
var MapKAY;
(function (MapKAY) {
    // map_attach_listener      用来记录已经被 Attach  的函数Listener
    // map_find_class_cache     find_class 的缓存
    // outFilterMap             filterDuplicateOBJ
    // CommonCache 通用缓存      目前暂时只用来缓存 Text
    MapKAY[MapKAY["map_attach_listener"] = 0] = "map_attach_listener";
    MapKAY[MapKAY["map_find_class_cache"] = 1] = "map_find_class_cache";
    MapKAY[MapKAY["map_find_method_cache"] = 2] = "map_find_method_cache";
    MapKAY[MapKAY["outFilterMap"] = 3] = "outFilterMap";
    MapKAY[MapKAY["CommonCache"] = 4] = "CommonCache";
})(MapKAY = exports.MapKAY || (exports.MapKAY = {}));
//array key
var ArrKAY;
(function (ArrKAY) {
    // arr_img_addr
    // arr_img_names    存放初始化（list_Images）时候的 imgAddr 以及 imgName
    // findClassCache   第二次使用findClass的缓存
    // arr_nop_addr     用来记录已经被 replace 的函数地址
    // arr_runtimeType  用来记录运行时类型
    // findMethodArray  只存在于B时候的临时变量，用来记录需要断点的方法地址并方便 b 移除，避免重复显示
    // t_arrayAddr      过滤 只显示指定ClassName下的Methods filterClass.push("clsName") //即可开启过滤clsName
    // filterClass      clsName 如果显示不全可以使用 getClassName(ptr) 得到全名，不用过滤的时候置空这个array即可
    // arrMethodInfo    存放MethodInfo指针（供动态断点 a() 提供更详细的信息）
    ArrKAY[ArrKAY["arr_img_addr"] = 0] = "arr_img_addr";
    ArrKAY[ArrKAY["arr_img_names"] = 1] = "arr_img_names";
    ArrKAY[ArrKAY["findClassCache"] = 2] = "findClassCache";
    ArrKAY[ArrKAY["arr_nop_addr"] = 3] = "arr_nop_addr";
    ArrKAY[ArrKAY["arr_runtimeType"] = 4] = "arr_runtimeType";
    ArrKAY[ArrKAY["findMethodArray"] = 5] = "findMethodArray";
    ArrKAY[ArrKAY["t_arrayAddr"] = 6] = "t_arrayAddr";
    ArrKAY[ArrKAY["filterClass"] = 7] = "filterClass";
    ArrKAY[ArrKAY["arrMethodInfo"] = 8] = "arrMethodInfo";
    ArrKAY[ArrKAY["arrayAddr"] = 9] = "arrayAddr";
    ArrKAY[ArrKAY["arrayName"] = 10] = "arrayName";
})(ArrKAY = exports.ArrKAY || (exports.ArrKAY = {}));
var il2cppTabledefs;
(function (il2cppTabledefs) {
    il2cppTabledefs[il2cppTabledefs["METHOD_ATTRIBUTE_MEMBER_ACCESS_MASK"] = 7] = "METHOD_ATTRIBUTE_MEMBER_ACCESS_MASK";
    il2cppTabledefs[il2cppTabledefs["METHOD_ATTRIBUTE_COMPILER_CONTROLLED"] = 0] = "METHOD_ATTRIBUTE_COMPILER_CONTROLLED";
    il2cppTabledefs[il2cppTabledefs["METHOD_ATTRIBUTE_PRIVATE"] = 1] = "METHOD_ATTRIBUTE_PRIVATE";
    il2cppTabledefs[il2cppTabledefs["METHOD_ATTRIBUTE_FAM_AND_ASSEM"] = 2] = "METHOD_ATTRIBUTE_FAM_AND_ASSEM";
    il2cppTabledefs[il2cppTabledefs["METHOD_ATTRIBUTE_ASSEM"] = 3] = "METHOD_ATTRIBUTE_ASSEM";
    il2cppTabledefs[il2cppTabledefs["METHOD_ATTRIBUTE_FAMILY"] = 4] = "METHOD_ATTRIBUTE_FAMILY";
    il2cppTabledefs[il2cppTabledefs["METHOD_ATTRIBUTE_FAM_OR_ASSEM"] = 5] = "METHOD_ATTRIBUTE_FAM_OR_ASSEM";
    il2cppTabledefs[il2cppTabledefs["METHOD_ATTRIBUTE_PUBLIC"] = 6] = "METHOD_ATTRIBUTE_PUBLIC";
    il2cppTabledefs[il2cppTabledefs["METHOD_ATTRIBUTE_STATIC"] = 16] = "METHOD_ATTRIBUTE_STATIC";
    il2cppTabledefs[il2cppTabledefs["METHOD_ATTRIBUTE_FINAL"] = 32] = "METHOD_ATTRIBUTE_FINAL";
    il2cppTabledefs[il2cppTabledefs["METHOD_ATTRIBUTE_VIRTUAL"] = 64] = "METHOD_ATTRIBUTE_VIRTUAL";
    il2cppTabledefs[il2cppTabledefs["METHOD_ATTRIBUTE_ABSTRACT"] = 1024] = "METHOD_ATTRIBUTE_ABSTRACT";
    il2cppTabledefs[il2cppTabledefs["METHOD_ATTRIBUTE_PINVOKE_IMPL"] = 8192] = "METHOD_ATTRIBUTE_PINVOKE_IMPL";
    il2cppTabledefs[il2cppTabledefs["METHOD_ATTRIBUTE_VTABLE_LAYOUT_MASK"] = 256] = "METHOD_ATTRIBUTE_VTABLE_LAYOUT_MASK";
    il2cppTabledefs[il2cppTabledefs["METHOD_ATTRIBUTE_REUSE_SLOT"] = 0] = "METHOD_ATTRIBUTE_REUSE_SLOT";
    il2cppTabledefs[il2cppTabledefs["METHOD_ATTRIBUTE_NEW_SLOT"] = 256] = "METHOD_ATTRIBUTE_NEW_SLOT";
})(il2cppTabledefs = exports.il2cppTabledefs || (exports.il2cppTabledefs = {}));
var FieldAccess;
(function (FieldAccess) {
    FieldAccess[FieldAccess["FIELD_ATTRIBUTE_FIELD_ACCESS_MASK"] = 7] = "FIELD_ATTRIBUTE_FIELD_ACCESS_MASK";
    FieldAccess[FieldAccess["FIELD_ATTRIBUTE_COMPILER_CONTROLLED"] = 0] = "FIELD_ATTRIBUTE_COMPILER_CONTROLLED";
    FieldAccess[FieldAccess["FIELD_ATTRIBUTE_PRIVATE"] = 1] = "FIELD_ATTRIBUTE_PRIVATE";
    FieldAccess[FieldAccess["FIELD_ATTRIBUTE_FAM_AND_ASSEM"] = 2] = "FIELD_ATTRIBUTE_FAM_AND_ASSEM";
    FieldAccess[FieldAccess["FIELD_ATTRIBUTE_ASSEMBLY"] = 3] = "FIELD_ATTRIBUTE_ASSEMBLY";
    FieldAccess[FieldAccess["FIELD_ATTRIBUTE_FAMILY"] = 4] = "FIELD_ATTRIBUTE_FAMILY";
    FieldAccess[FieldAccess["FIELD_ATTRIBUTE_FAM_OR_ASSEM"] = 5] = "FIELD_ATTRIBUTE_FAM_OR_ASSEM";
    FieldAccess[FieldAccess["FIELD_ATTRIBUTE_PUBLIC"] = 6] = "FIELD_ATTRIBUTE_PUBLIC";
    FieldAccess[FieldAccess["FIELD_ATTRIBUTE_STATIC"] = 16] = "FIELD_ATTRIBUTE_STATIC";
    FieldAccess[FieldAccess["FIELD_ATTRIBUTE_INIT_ONLY"] = 32] = "FIELD_ATTRIBUTE_INIT_ONLY";
    FieldAccess[FieldAccess["FIELD_ATTRIBUTE_LITERAL"] = 64] = "FIELD_ATTRIBUTE_LITERAL";
    FieldAccess[FieldAccess["FIELD_ATTRIBUTE_NOT_SERIALIZED"] = 128] = "FIELD_ATTRIBUTE_NOT_SERIALIZED";
    FieldAccess[FieldAccess["FIELD_ATTRIBUTE_SPECIAL_NAME"] = 512] = "FIELD_ATTRIBUTE_SPECIAL_NAME";
    FieldAccess[FieldAccess["FIELD_ATTRIBUTE_PINVOKE_IMPL"] = 8192] = "FIELD_ATTRIBUTE_PINVOKE_IMPL";
    FieldAccess[FieldAccess["FIELD_ATTRIBUTE_RESERVED_MASK"] = 38144] = "FIELD_ATTRIBUTE_RESERVED_MASK";
    FieldAccess[FieldAccess["FIELD_ATTRIBUTE_RT_SPECIAL_NAME"] = 1024] = "FIELD_ATTRIBUTE_RT_SPECIAL_NAME";
    FieldAccess[FieldAccess["FIELD_ATTRIBUTE_HAS_FIELD_MARSHAL"] = 4096] = "FIELD_ATTRIBUTE_HAS_FIELD_MARSHAL";
    FieldAccess[FieldAccess["FIELD_ATTRIBUTE_HAS_DEFAULT"] = 32768] = "FIELD_ATTRIBUTE_HAS_DEFAULT";
    FieldAccess[FieldAccess["FIELD_ATTRIBUTE_HAS_FIELD_RVA"] = 256] = "FIELD_ATTRIBUTE_HAS_FIELD_RVA";
})(FieldAccess = exports.FieldAccess || (exports.FieldAccess = {}));
var LogColor;
(function (LogColor) {
    LogColor[LogColor["WHITE"] = 0] = "WHITE";
    LogColor[LogColor["RED"] = 1] = "RED";
    LogColor[LogColor["YELLOW"] = 3] = "YELLOW";
    LogColor[LogColor["C31"] = 31] = "C31";
    LogColor[LogColor["C32"] = 32] = "C32";
    LogColor[LogColor["C33"] = 33] = "C33";
    LogColor[LogColor["C34"] = 34] = "C34";
    LogColor[LogColor["C35"] = 35] = "C35";
    LogColor[LogColor["C36"] = 36] = "C36";
    LogColor[LogColor["C41"] = 41] = "C41";
    LogColor[LogColor["C42"] = 42] = "C42";
    LogColor[LogColor["C43"] = 43] = "C43";
    LogColor[LogColor["C44"] = 44] = "C44";
    LogColor[LogColor["C45"] = 45] = "C45";
    LogColor[LogColor["C46"] = 46] = "C46";
    LogColor[LogColor["C90"] = 90] = "C90";
    LogColor[LogColor["C91"] = 91] = "C91";
    LogColor[LogColor["C92"] = 92] = "C92";
    LogColor[LogColor["C93"] = 93] = "C93";
    LogColor[LogColor["C94"] = 94] = "C94";
    LogColor[LogColor["C95"] = 95] = "C95";
    LogColor[LogColor["C96"] = 96] = "C96";
    LogColor[LogColor["C97"] = 97] = "C97";
    LogColor[LogColor["C100"] = 100] = "C100";
    LogColor[LogColor["C101"] = 101] = "C101";
    LogColor[LogColor["C102"] = 102] = "C102";
    LogColor[LogColor["C103"] = 103] = "C103";
    LogColor[LogColor["C104"] = 104] = "C104";
    LogColor[LogColor["C105"] = 105] = "C105";
    LogColor[LogColor["C106"] = 106] = "C106";
    LogColor[LogColor["C107"] = 107] = "C107";
})(LogColor = exports.LogColor || (exports.LogColor = {}));
var ADS_TYPE;
(function (ADS_TYPE) {
    ADS_TYPE[ADS_TYPE["IronSource"] = 0] = "IronSource";
    ADS_TYPE[ADS_TYPE["MaxSdkCallbacks"] = 1] = "MaxSdkCallbacks";
    ADS_TYPE[ADS_TYPE["MoPubManager"] = 2] = "MoPubManager";
    ADS_TYPE[ADS_TYPE["TTPluginsGameObject"] = 3] = "TTPluginsGameObject";
})(ADS_TYPE = exports.ADS_TYPE || (exports.ADS_TYPE = {}));
// (NativePointer as any).prototype.callFunction = function (...args: any[]): NativePointer {
//     return callFunction(this, ...args)
// }
// Object.defineProperty(NativePointer.prototype, "callFunction", {
//     value: function (...args: any[]): NativePointer {
//         return callFunction(this, ...args)
//     }
// })
NativePointer.prototype.callFunction = function (...args) {
    return ptr(1);
};
Object.defineProperty(NativePointer.prototype, "callFunction", {
    value: function (...args) {
        return ptr(2);
    }
});
},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOP_MAP = exports.NOP_ARRAY = exports.SET_ARRAY = exports.GET_ARRAY = exports.GET_MAP_VALUE = exports.SET_MAP_VALUE = exports.SET_MAP = exports.GET_MAP = exports.SET_G = exports.GET_GT = exports.GET_G = exports.GET_F = exports.SET_F_A = exports.SET_F = exports.SET_A = exports.GET_A = exports.newThreadCallBack = exports.p_size = exports.soName = void 0;
exports.soName = "libil2cpp.so";
exports.p_size = Process.pointerSize;
let newThreadCallBack = () => { };
exports.newThreadCallBack = newThreadCallBack;
// export type GameObject = NativePointer
// export type Component = NativePointer
// export type Transform = NativePointer
// ---------------------- 全局变量 ---------------------- 
// 记录函数地址 address (SET_A:set address / GET_A:get address)
let MAP_EXPORT_ADDRESS = new Map();
const GET_A = (typeEp) => MAP_EXPORT_ADDRESS.get(typeEp);
exports.GET_A = GET_A;
const SET_A = (typeEp, mPtr) => MAP_EXPORT_ADDRESS.set(typeEp, mPtr);
exports.SET_A = SET_A;
// 记录函数 function (SET_F:set function / GET_F:get function)
let MAP_EXPORT_FUNCTIONS = new Map();
function SET_F(type, func) {
    MAP_EXPORT_FUNCTIONS.set(type, func);
    (0, exports.SET_A)(type, func);
}
exports.SET_F = SET_F;
function SET_F_A(type, func) {
    MAP_EXPORT_FUNCTIONS.set(type, func);
    (0, exports.SET_A)(type, func);
}
exports.SET_F_A = SET_F_A;
function GET_F(type) {
    return MAP_EXPORT_FUNCTIONS.get(type);
}
exports.GET_F = GET_F;
// 记录全局变量
let MAP_GLOABE_OBJ = new Map();
const GET_G = (gKey) => MAP_GLOABE_OBJ.get(gKey);
exports.GET_G = GET_G;
function GET_GT(gKey) {
    let tmp = MAP_GLOABE_OBJ.get(gKey);
    if (tmp == undefined)
        tmp = 0;
    return MAP_GLOABE_OBJ.get(gKey);
}
exports.GET_GT = GET_GT;
function SET_G(gKey, obj) {
    return MAP_GLOABE_OBJ.set(gKey, obj);
}
exports.SET_G = SET_G;
function GET_MAP(tKay) {
    if (MAP_GLOABE_OBJ.get(tKay)) {
        return MAP_GLOABE_OBJ.get(tKay);
    }
    else {
        let tmp = new Map();
        SET_MAP(tKay, tmp);
        return tmp;
    }
}
exports.GET_MAP = GET_MAP;
function SET_MAP(tKay, map) {
    MAP_GLOABE_OBJ.set(tKay, map);
}
exports.SET_MAP = SET_MAP;
function SET_MAP_VALUE(tKay, key, value) {
    SET_MAP(tKay, GET_MAP(tKay).set(key, value));
}
exports.SET_MAP_VALUE = SET_MAP_VALUE;
function GET_MAP_VALUE(tKay, key) {
    return GET_MAP(tKay).get(key);
}
exports.GET_MAP_VALUE = GET_MAP_VALUE;
function GET_ARRAY(tKay) {
    if (MAP_GLOABE_OBJ.get(tKay)) {
        return MAP_GLOABE_OBJ.get(tKay);
    }
    else {
        let tmp = new Array();
        SET_ARRAY(tKay, tmp);
        return tmp;
    }
}
exports.GET_ARRAY = GET_ARRAY;
function SET_ARRAY(tKay, array) {
    MAP_GLOABE_OBJ.set(tKay, array);
}
exports.SET_ARRAY = SET_ARRAY;
function NOP_ARRAY(tKay) {
    MAP_GLOABE_OBJ.delete(tKay);
}
exports.NOP_ARRAY = NOP_ARRAY;
function NOP_MAP(tKay) {
    MAP_GLOABE_OBJ.delete(tKay);
}
exports.NOP_MAP = NOP_MAP;
globalThis.MAP_EXPORT_FUNCTIONS = MAP_EXPORT_FUNCTIONS.forEach((value, key) => { LOGD(`${key} => ${value}`); });
globalThis.MAP_EXPORT_ADDRESS = MAP_EXPORT_ADDRESS;
globalThis.MAP_GLOABE_OBJ = MAP_GLOABE_OBJ;
globalThis.p_size = exports.p_size;
},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showMethodInfo = void 0;
const showMethodInfo = (methodInfo) => {
    if (typeof methodInfo == "number")
        methodInfo = ptr(methodInfo);
    let packMethod = new Il2Cpp.Method(methodInfo);
    let Il2CppClass = packMethod.class.handle;
    let Il2CppImage = packMethod.class.image.handle;
    let Il2CppAssembly = packMethod.class.image.assembly.handle;
    LOGH("Function: " + packMethod.name + "\t" + packMethod.parameterCount + "\t0x" + Number(methodInfo).toString(16) + " ---> "
        + packMethod.virtualAddress + " ---> " + packMethod.relativeVirtualAddress + "\n");
    LOGH(packMethod.name + " ---> " + packMethod.class.name + "(" + Il2CppClass + ") ---> " + (packMethod.class.namespace.length == 0 ? " - " : packMethod.class.namespace)
        + " ---> " + packMethod.class.image.name + "(" + Il2CppImage + ") ---> Il2CppAssembly(" + Il2CppAssembly + ")\n");
    if (packMethod.parameterCount != 0)
        LOGH("ARGS: " + packMethod.parameters.map(p => p.type.name + "(" + p.type.handle + ") " + p.name).join(", ") + "\n");
};
exports.showMethodInfo = showMethodInfo;
globalThis.showMethodInfo = showMethodInfo;
},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const il2cppMethod_1 = require("../bridge/fix/il2cppMethod");
const class_1 = require("../expand/TypeExtends/mscorlibObj/Object/class");
const class_2 = require("../expand/TypeExtends/mscorlibObj/ValueType/Color/class");
const formart_1 = require("../utils/formart");
const reader_1 = require("../utils/reader");
class ValueResolve {
    cacheId = "";
    method;
    args;
    retval = ptr(0);
    constructor(cacheID, methodInfo) {
        this.cacheId = cacheID;
        this.method = methodInfo;
        this.args = new Array(methodInfo.genericParameterCount);
    }
    getCacheId() {
        return this.cacheId;
    }
    setCacheId(cacheId) {
        this.cacheId = cacheId;
        return this;
    }
    getMethod() {
        return this.method;
    }
    setMethod(method) {
        this.method = method;
        this.args = new Array(method.genericParameterCount);
        return this;
    }
    setArg(index, arg) {
        this.args[index] = arg;
        return this;
    }
    setRetval(retval) {
        this.retval = retval;
        return this;
    }
    getArg(index) {
        return this.args[index];
    }
    getRetval() {
        return this.retval;
    }
    getArgs() {
        return this.args;
    }
    getArgsCount() {
        return this.method.parameterCount;
    }
    setArgs(value) {
        if (value == undefined || value.length === 0 || value.length < this.method.parameterCount)
            return this;
        this.args = value;
        return this;
    }
    static MapCacheStringWithOutValue = new Map();
    toString() {
        let cache = ValueResolve.MapCacheStringWithOutValue.get(this.cacheId);
        if (cache)
            return cache;
        let addressInfo = ` ${this.method.handle} -> ${this.method.relativeVirtualAddress} `;
        let append = "";
        let length = String(this.method.class.handle).length + 1;
        try {
            append += ",";
            append += formart_1.formartClass.alignStr(String(this.args[0]), length, " ");
        }
        catch {
            append += "  ";
            append += formart_1.formartClass.getLine(length, " ");
        }
        let classInfo = `${formart_1.formartClass.alignStr(this.method.class.name, 18)}(${this.method.class.handle}${append.trim()})`;
        let infoContent = `===>  ${(0, il2cppMethod_1.methodToString)(this.method, true)}\t `;
        let retStr = `${this.cacheId}\t${addressInfo}\t|  ${classInfo}  ${infoContent}`;
        ValueResolve.MapCacheStringWithOutValue.set(this.cacheId, retStr);
        return retStr;
    }
    resolve(index) {
        if (index > this.method.parameterCount)
            throw new Error("index out of parameterCount range");
        let args = index == -1 ? this.retval : this.args[index];
        let type = index == -1 ? this.method.returnType : this.method.parameters[index].type;
        return ValueResolve.fakeValue(args, type, this.method);
    }
    static fakeValue = (insPtr, type, method) => {
        if (typeof insPtr == "number")
            insPtr = ptr(insPtr);
        if (typeof method == "number")
            method = new Il2Cpp.Method(ptr(method));
        if (type.handle.equals(1))
            return new Il2Cpp.Object(insPtr).toString();
        if (type.isNull() || method.isNull())
            return "";
        if (insPtr.isNull() && type.name != "System.Boolean" && !method.class.isEnum && !type.name.includes("Void"))
            return "NULL";
        if (!method.class.isNull() && type.name.endsWith("[]"))
            return arrayType();
        if (!method.class.isNull() && type.name.includes("Dictionary"))
            return dictionaryType();
        if (!method.class.isNull() && method.class.isEnum)
            return enumType();
        return CommonType(type);
        function arrayType() {
            return "";
        }
        function dictionaryType() {
            return "";
        }
        function enumType() {
            return "";
        }
        function CommonType(type) {
            switch (type.name) {
                case "System.Void":
                    return "";
                case "System.Boolean":
                    return !insPtr.isNull() ? "True" : "False";
                case "System.Int32":
                    return (0, reader_1.readInt)(insPtr).toString();
                case "System.UInt32":
                    return (0, reader_1.readUInt)(insPtr).toString();
                case "System.Int64":
                    return (0, reader_1.readInt64)(insPtr).toString();
                case "System.Single":
                    return (0, reader_1.readSingle)(insPtr).toString();
                case "System.String":
                    return (0, reader_1.readU16)(insPtr);
                case "System.Object":
                    return getObjName(insPtr);
                case "System.UnityEngine":
                    return new class_1.ObjectIl2cpp_impl(insPtr).get_name();
                case "UnityEngine.Color":
                    return new class_2.ColorImpl(insPtr).toString();
                case "Vector2":
                    return `${insPtr.readFloat()} ${insPtr.add(4).readFloat()}`;
                case "System.Action":
                case "System.Action`1":
                case "System.Action`2":
                    return insPtr.add(Process.pageSize === 4 ? 0x14 : 0x10).readPointer().readPointer().sub(soAddr).toString();
                default:
                    try {
                        return new Il2Cpp.Object(insPtr).toString();
                    }
                    catch (error) {
                        return "";
                    }
            }
        }
        function getParentsStr(clsPtr) {
            let ret = "";
            while (true) {
                let parent = clsPtr.parent;
                if (parent != null) {
                    clsPtr = parent;
                    ret += clsPtr.name + "<---";
                }
                else {
                    // LOGD(ret)
                    return ret;
                }
            }
        }
    };
}
exports.default = ValueResolve;
},{"../bridge/fix/il2cppMethod":12,"../expand/TypeExtends/mscorlibObj/Object/class":82,"../expand/TypeExtends/mscorlibObj/ValueType/Color/class":106,"../utils/formart":134,"../utils/reader":137}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PackerObject extends Il2Cpp.Object {
    methods = [];
    fields = [];
    invoke(...args) {
    }
}
class Packer extends Il2Cpp.Object {
    methods = this.class.methods;
    fields = this.class.fields;
    pack() {
        return new Proxy(this.class, {
            get: (target, property) => {
                Reflect.set(target, "methods", this.methods);
                Reflect.set(target, "fields", this.fields);
                return Reflect.get(target, property);
            }
        });
    }
}
function packPack(mPtr) {
    if (typeof mPtr == "number")
        mPtr = ptr(mPtr);
    return new Packer(mPtr).fields["12"].value;
}
Reflect.set(globalThis, "pack", packPack);
},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
Reflect.defineProperty(Il2Cpp.Class, "prettyString", {
    value: function () {
        var proto = Il2Cpp.Class.prototype;
        return `${proto.isEnum ? `enum` : proto.isValueType ? `struct` : proto.isInterface ? `interface` : `class`}`;
    }
});
},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methodToString = exports.methodToArray = exports.getMethodDesFromMethodPtr = exports.getMethodModifier = void 0;
const enum_1 = require("../../base/enum");
// 解析 Method 的权限符
const getMethodModifier = (methodPtr) => {
    if (typeof methodPtr == "number")
        methodPtr = ptr(methodPtr);
    let localMethod;
    // let flags = methodPtr.add(p_size * 8 + 4).readU16()
    if (methodPtr instanceof Il2Cpp.Method) {
        localMethod = methodPtr;
    }
    else if (typeof methodPtr == "number") {
        localMethod = new Il2Cpp.Method(ptr(methodPtr));
    }
    else {
        localMethod = new Il2Cpp.Method(methodPtr);
    }
    let flags = localMethod.flags;
    let access = flags & enum_1.il2cppTabledefs.METHOD_ATTRIBUTE_MEMBER_ACCESS_MASK;
    let ret_str = "";
    switch (access) {
        case enum_1.il2cppTabledefs.METHOD_ATTRIBUTE_PRIVATE:
            ret_str += "private ";
            break;
        case enum_1.il2cppTabledefs.METHOD_ATTRIBUTE_PUBLIC:
            ret_str += "public ";
            break;
        case enum_1.il2cppTabledefs.METHOD_ATTRIBUTE_FAMILY:
            ret_str += "protected ";
            break;
        case enum_1.il2cppTabledefs.METHOD_ATTRIBUTE_ASSEM:
        case enum_1.il2cppTabledefs.METHOD_ATTRIBUTE_FAM_AND_ASSEM:
            ret_str += "internal ";
            break;
        case enum_1.il2cppTabledefs.METHOD_ATTRIBUTE_FAM_OR_ASSEM:
            ret_str += "protected internal ";
            break;
    }
    if (flags & enum_1.il2cppTabledefs.METHOD_ATTRIBUTE_STATIC) {
        ret_str += "static ";
    }
    if (flags & enum_1.il2cppTabledefs.METHOD_ATTRIBUTE_ABSTRACT) {
        ret_str += "abstract ";
        if ((flags & enum_1.il2cppTabledefs.METHOD_ATTRIBUTE_VTABLE_LAYOUT_MASK) == enum_1.il2cppTabledefs.METHOD_ATTRIBUTE_REUSE_SLOT) {
            ret_str += "override ";
        }
    }
    else if (flags & enum_1.il2cppTabledefs.METHOD_ATTRIBUTE_FINAL) {
        if ((flags & enum_1.il2cppTabledefs.METHOD_ATTRIBUTE_VTABLE_LAYOUT_MASK) == enum_1.il2cppTabledefs.METHOD_ATTRIBUTE_REUSE_SLOT) {
            ret_str += "sealed override ";
        }
    }
    else if (flags & enum_1.il2cppTabledefs.METHOD_ATTRIBUTE_VIRTUAL) {
        if ((flags & enum_1.il2cppTabledefs.METHOD_ATTRIBUTE_VTABLE_LAYOUT_MASK) == enum_1.il2cppTabledefs.METHOD_ATTRIBUTE_NEW_SLOT) {
            ret_str += "virtual ";
        }
        else {
            ret_str += "override ";
        }
    }
    if (flags & enum_1.il2cppTabledefs.METHOD_ATTRIBUTE_PINVOKE_IMPL) {
        ret_str += "extern ";
    }
    return ret_str;
};
exports.getMethodModifier = getMethodModifier;
const getMethodDesFromMethodPtr = (methodPtr, simpleType = true) => {
    if (typeof methodPtr == "number")
        methodPtr = ptr(methodPtr);
    if (methodPtr == null || methodPtr.isNull())
        throw new Error("getMethodDesFromMethodPtr: methodPtr can't be null");
    let localMethod = methodPtr instanceof Il2Cpp.Method ? methodPtr : new Il2Cpp.Method(methodPtr);
    let returnTypeArr = localMethod.returnType.name.split(".");
    let ret_str = "";
    ret_str += (0, exports.getMethodModifier)(localMethod);
    ret_str += `${returnTypeArr[returnTypeArr.length - 1]} `;
    ret_str += localMethod.name;
    ret_str += "(" + localMethod.parameters.map(x => `${simpleType ? (function (name) {
        let sp = name.split(".");
        return sp[sp.length - 1];
    }(x.type.name)) : x.type.name} ${x.name}`).join(",") + ")";
    return ret_str;
};
exports.getMethodDesFromMethodPtr = getMethodDesFromMethodPtr;
// 缓存 method info to array
const map_cache_method_des = new Map();
const methodToArray = (method) => {
    if (method instanceof NativePointer) {
        return getArrayFromMethod(new Il2Cpp.Method(method));
    }
    else if (typeof method == "number") {
        return getArrayFromMethod(new Il2Cpp.Method(ptr(method)));
    }
    else if (method instanceof Il2Cpp.Method) {
        return getArrayFromMethod(method);
    }
    else {
        throw new Error("methodToArray: method unknown type");
    }
    // [
    //     "0xbf88b6f4",
    //     "0xc81e101c",
    //     "0x99901c",
    //     "public static x0y1(Vector2 v)",
    //     "0xbf9ee3e0",
    //     "ExtensionMethods"
    // ]
    function getArrayFromMethod(method) {
        let cache = map_cache_method_des.get(method);
        if (cache != undefined)
            return cache;
        let ret_arr = [];
        ret_arr.push(method.handle); // 0
        ret_arr.push(method.virtualAddress); // 1
        ret_arr.push(method.virtualAddress.isNull() ? ptr(0) : method.relativeVirtualAddress); // 2
        ret_arr.push((0, exports.getMethodDesFromMethodPtr)(method)); // 3
        ret_arr.push(method.class.handle); // 4
        ret_arr.push(method.class.name); // 5
        map_cache_method_des.set(method, ret_arr);
        return ret_arr;
    }
};
exports.methodToArray = methodToArray;
//Il2Cpp.Method toString impl
const methodToString = (method, simple = false) => {
    let arr = (0, exports.methodToArray)(method);
    if (arr == undefined)
        throw new Error("methodToString: methodToArray return undefined");
    // ctor cctor
    if (simple)
        return `${arr[3]} ${(method.name.includes("ctor")) ? `   { class => ${arr[5]}( ${arr[4]} ) }` : ""}`;
    let displayStr = `[*] `;
    displayStr += `${arr[0]} ---> `;
    displayStr += `${arr[1]} (${arr[2]})`;
    displayStr += `${arr[1].isNull() ? `\t\t\t` : `\t`}|  `;
    displayStr += `${arr[3]}`;
    if (method.name.includes(".ctor"))
        displayStr += `   { class => ${arr[5]}( ${arr[4]} ) } `;
    return displayStr;
};
exports.methodToString = methodToString;
globalThis.methodToArray = exports.methodToArray;
},{"../../base/enum":5}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./apiExtends/apiExtends");
require("./mscorlibObj/include");
require("./thread/_include");
},{"./apiExtends/apiExtends":14,"./mscorlibObj/include":113,"./thread/_include":115}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function transfromStrToFunction(AssemblyName, NameSpaces, functionName, argsCount = -1, retType, argTypes) {
    return overloadTransfromStrToFunction(AssemblyName, NameSpaces, functionName, argsCount, [], retType, argTypes);
}
function overloadTransfromStrToFunction(AssemblyName, NameSpaces, functionName, argsCount = -1, overload, retType, argTypes) {
    let method = findMethod(AssemblyName, NameSpaces, functionName, argsCount, overload, false);
    if (method == undefined)
        throw new Error(`method ${functionName} not found`);
    let exportPointer = method.virtualAddress;
    if (exportPointer == null)
        throw new Error("Could not find method");
    return new NativeFunction(exportPointer, retType, argTypes);
}
Il2Cpp.Api.t = transfromStrToFunction;
Il2Cpp.Api.o = overloadTransfromStrToFunction;
},{}],15:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointerEventDataAPI = void 0;
const decorator_cache_getter_1 = require("decorator-cache-getter");
class PointerEventDataAPI {
    static get _ctor_1() {
        // .ctor()
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", ".ctor", 1, "void", ["pointer"]);
    }
    static get _IsPointerMoving() {
        // IsPointerMoving() : Boolean
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "IsPointerMoving", 0, "bool", ["pointer"]);
    }
    static get _IsScrolling() {
        // IsScrolling() : Boolean
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "IsScrolling", 0, "bool", ["pointer"]);
    }
    static get _ToString() {
        // ToString() : String
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "ToString", 0, "pointer", ["pointer"]);
    }
    static get _set_button() {
        // set_button(InputButton) : Void
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "set_button", 1, "void", ["pointer", "pointer"]);
    }
    static get _get_button() {
        // get_button() : InputButton
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "get_button", 0, "pointer", ["pointer"]);
    }
    static get _set_clickCount() {
        // set_clickCount(Int32) : Void
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "set_clickCount", 1, "void", ["pointer", "int"]);
    }
    static get _get_clickCount() {
        // get_clickCount() : Int32
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "get_clickCount", 0, "int", ["pointer"]);
    }
    static get _set_clickTime() {
        // set_clickTime(Int32) : Void
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "set_clickTime", 1, "void", ["pointer", "int"]);
    }
    static get _get_clickTime() {
        // get_clickTime() : Int32
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "get_clickTime", 0, "int", ["pointer"]);
    }
    static get _set_delta() {
        // set_delta(Vector2) : Void
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "set_delta", 1, "void", ["pointer", "pointer"]);
    }
    static get _get_delta() {
        // get_delta() : Vector2
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "get_delta", 0, "pointer", ["pointer"]);
    }
    static get _set_dragging() {
        // set_dragging(Boolean) : Void
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "set_dragging", 1, "void", ["pointer", "bool"]);
    }
    static get _get_dragging() {
        // get_dragging() : Boolean
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "get_dragging", 0, "bool", ["pointer"]);
    }
    static get _set_eligibleForClick() {
        // set_eligibleForClick(Boolean) : Void
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "set_eligibleForClick", 1, "void", ["pointer", "bool"]);
    }
    static get _get_eligibleForClick() {
        // get_eligibleForClick() : Boolean
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "get_eligibleForClick", 0, "bool", ["pointer"]);
    }
    static get _set_pointerId() {
        // set_pointerId(Int32) : Void
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "set_pointerId", 1, "void", ["pointer", "int"]);
    }
    static get _get_pointerId() {
        // get_pointerId() : Int32
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "get_pointerId", 0, "int", ["pointer"]);
    }
    static get _set_pointerPress() {
        // set_pointerPress(GameObject) : Void
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "set_pointerPress", 1, "void", ["pointer", "pointer"]);
    }
    static get _get_pointerPress() {
        // get_pointerPress() : GameObject
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "get_pointerPress", 0, "pointer", ["pointer"]);
    }
    static get _set_pointerPressRaycast() {
        // set_pointerPressRaycast(RaycastResult) : Void
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "set_pointerPressRaycast", 1, "void", ["pointer", "pointer"]);
    }
    static get _get_pointerPressRaycast() {
        // get_pointerPressRaycast() : RaycastResult
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "get_pointerPressRaycast", 0, "pointer", ["pointer"]);
    }
    static get _set_position() {
        // set_position(Vector2) : Void
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "set_position", 1, "void", ["pointer", "pointer"]);
    }
    static get _get_position() {
        // get_position() : Vector2
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "get_position", 0, "pointer", ["pointer"]);
    }
    static get _get_pressEventCamera() {
        // get_pressEventCamera() : Camera
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "get_pressEventCamera", 0, "pointer", ["pointer"]);
    }
    static get _set_pressPosition() {
        // set_pressPosition(Vector2) : Void
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "set_pressPosition", 1, "void", ["pointer", "pointer"]);
    }
    static get _get_pressPosition() {
        // get_pressPosition() : Vector2
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "get_pressPosition", 0, "pointer", ["pointer"]);
    }
    static get _set_rawPointerPress() {
        // set_rawPointerPress(GameObject) : Void
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "set_rawPointerPress", 1, "void", ["pointer", "pointer"]);
    }
    static get _get_rawPointerPress() {
        // get_rawPointerPress() : GameObject
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "get_rawPointerPress", 0, "pointer", ["pointer"]);
    }
    static get _set_scrollDelta() {
        // set_scrollDelta(Vector2) : Void
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "set_scrollDelta", 1, "void", ["pointer", "pointer"]);
    }
    static get _get_scrollDelta() {
        // get_scrollDelta() : Vector2
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "get_scrollDelta", 0, "pointer", ["pointer"]);
    }
    static get _set_useDragThreshold() {
        // set_useDragThreshold(Boolean) : Void
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "set_useDragThreshold", 1, "void", ["pointer", "bool"]);
    }
    static get _get_useDragThreshold() {
        // get_useDragThreshold() : Boolean
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "get_useDragThreshold", 0, "bool", ["pointer"]);
    }
    static get _set_worldNormal() {
        // set_worldNormal(Vector3) : Void
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "set_worldNormal", 1, "void", ["pointer", "pointer"]);
    }
    static get _get_worldNormal() {
        // get_worldNormal() : Vector3
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "get_worldNormal", 0, "pointer", ["pointer"]);
    }
    static get _set_worldPosition() {
        // set_worldPosition(Vector3) : Void
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "set_worldPosition", 1, "void", ["pointer", "pointer"]);
    }
    static get _get_worldPosition() {
        // get_worldPosition() : Vector3
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "get_worldPosition", 0, "pointer", ["pointer"]);
    }
    static get _get_enterEventCamera() {
        // get_enterEventCamera(Camera) : Void
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "get_enterEventCamera", 1, "void", ["pointer", "pointer"]);
    }
    static get _get_pointerCurrentRaycast() {
        // get_pointerCurrentRaycast() : RaycastResult
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "get_pointerCurrentRaycast", 0, "pointer", ["pointer"]);
    }
    static get _set_pointerCurrentRaycast() {
        // set_pointerCurrentRaycast(RaycastResult) : Void
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "set_pointerCurrentRaycast", 1, "void", ["pointer", "pointer"]);
    }
    static get _get_pointerEnter() {
        // get_pointerEnter() : GameObject
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "get_pointerEnter", 0, "pointer", ["pointer"]);
    }
    static get _set_pointerEnter() {
        // set_pointerEnter(GameObject) : Void
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "set_pointerEnter", 1, "void", ["pointer", "pointer"]);
    }
    static get _get_pointerDrag() {
        // get_pointerDrag() : GameObject
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "get_pointerDrag", 0, "pointer", ["pointer"]);
    }
    static get _set_lastPress() {
        // set_lastPress(GameObject) : Void
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "set_lastPress", 1, "void", ["pointer", "pointer"]);
    }
    static get _get_lastPress() {
        // get_lastPress() : GameObject
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.PointerEventData", "get_lastPress", 0, "pointer", ["pointer"]);
    }
}
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_ctor_1", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_IsPointerMoving", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_IsScrolling", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_ToString", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_set_button", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_get_button", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_set_clickCount", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_get_clickCount", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_set_clickTime", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_get_clickTime", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_set_delta", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_get_delta", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_set_dragging", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_get_dragging", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_set_eligibleForClick", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_get_eligibleForClick", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_set_pointerId", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_get_pointerId", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_set_pointerPress", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_get_pointerPress", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_set_pointerPressRaycast", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_get_pointerPressRaycast", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_set_position", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_get_position", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_get_pressEventCamera", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_set_pressPosition", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_get_pressPosition", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_set_rawPointerPress", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_get_rawPointerPress", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_set_scrollDelta", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_get_scrollDelta", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_set_useDragThreshold", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_get_useDragThreshold", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_set_worldNormal", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_get_worldNormal", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_set_worldPosition", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_get_worldPosition", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_get_enterEventCamera", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_get_pointerCurrentRaycast", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_set_pointerCurrentRaycast", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_get_pointerEnter", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_set_pointerEnter", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_get_pointerDrag", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_set_lastPress", null);
__decorate([
    decorator_cache_getter_1.cache
], PointerEventDataAPI, "_get_lastPress", null);
exports.PointerEventDataAPI = PointerEventDataAPI;
Il2Cpp.Api.PointerEventData = PointerEventDataAPI;
},{"decorator-cache-getter":139}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointerEventImpl = void 0;
const class_1 = require("../class");
class PointerEventImpl extends class_1.BaseEventDataImpl {
    ctor_11(eventSystem) {
        return new PointerEventImpl(Il2Cpp.Api.PointerEventData._ctor_1(alloc(), eventSystem));
    }
    IsPointerMoving() {
        return Il2Cpp.Api.PointerEventData._IsPointerMoving(this.handle);
    }
    IsScrolling() {
        return Il2Cpp.Api.PointerEventData._IsScrolling(this.handle);
    }
    toString() {
        return Il2Cpp.Api.PointerEventData._ToString(this.handle);
    }
    set_button(button) {
        return Il2Cpp.Api.PointerEventData._set_button(this.handle, button);
    }
    get_button() {
        return Il2Cpp.Api.PointerEventData._get_button(this.handle);
    }
    set_clickCount(clickCount) {
        return Il2Cpp.Api.PointerEventData._set_clickCount(this.handle, clickCount);
    }
    get_clickCount() {
        return Il2Cpp.Api.PointerEventData._get_clickCount(this.handle);
    }
    set_clickTime(clickTime) {
        return Il2Cpp.Api.PointerEventData._set_clickTime(this.handle, clickTime);
    }
    get_clickTime() {
        return Il2Cpp.Api.PointerEventData._get_clickTime(this.handle);
    }
    set_delta(delta) {
        return Il2Cpp.Api.PointerEventData._set_delta(this.handle, delta);
    }
    get_delta() {
        return Il2Cpp.Api.PointerEventData._get_delta(this.handle);
    }
    set_dragging(dragging) {
        return Il2Cpp.Api.PointerEventData._set_dragging(this.handle, dragging);
    }
    get_dragging() {
        return Il2Cpp.Api.PointerEventData._get_dragging(this.handle);
    }
    set_eligibleForClick(eligibleForClick) {
        return Il2Cpp.Api.PointerEventData._set_eligibleForClick(this.handle, eligibleForClick);
    }
    get_eligibleForClick() {
        return Il2Cpp.Api.PointerEventData._get_eligibleForClick(this.handle);
    }
    get_enterEventCamera() {
        return Il2Cpp.Api.PointerEventData._get_enterEventCamera(this.handle);
    }
    set_pointerCurrentRaycast(pointerCurrentRaycast) {
        return Il2Cpp.Api.PointerEventData._set_pointerCurrentRaycast(this.handle, pointerCurrentRaycast);
    }
    get_pointerCurrentRaycast() {
        return Il2Cpp.Api.PointerEventData._get_pointerCurrentRaycast(this.handle);
    }
    set_lastPress(lastPress) {
        return Il2Cpp.Api.PointerEventData._set_lastPress(this.handle, lastPress);
    }
    get_lastPress() {
        return new Il2Cpp.GameObject(Il2Cpp.Api.PointerEventData._get_lastPress(this.handle));
    }
    set_pointerDrag(pointerDrag) {
        return Il2Cpp.Api.PointerEventData._set_pointerEnter(this.handle, pointerDrag);
    }
    get_pointerDrag() {
        return new Il2Cpp.GameObject(Il2Cpp.Api.PointerEventData._get_pointerDrag(this.handle));
    }
    set_pointerEnter(pointerEnter) {
        return Il2Cpp.Api.PointerEventData._set_pointerEnter(this.handle, pointerEnter);
    }
    get_pointerEnter() {
        return new Il2Cpp.GameObject(Il2Cpp.Api.PointerEventData._get_pointerEnter(this.handle));
    }
    set_pointerId(pointerId) {
        return Il2Cpp.Api.PointerEventData._set_pointerId(this.handle, pointerId);
    }
    get_pointerId() {
        return Il2Cpp.Api.PointerEventData._get_pointerId(this.handle);
    }
    set_pointerPress(pointerPress) {
        return Il2Cpp.Api.PointerEventData._set_pointerPress(this.handle, pointerPress);
    }
    get_pointerPress() {
        return new Il2Cpp.GameObject(Il2Cpp.Api.PointerEventData._get_pointerPress(this.handle));
    }
    set_pointerPressRaycast(pointerPressRaycast) {
        return Il2Cpp.Api.PointerEventData._set_pointerPressRaycast(this.handle, pointerPressRaycast);
    }
    get_pointerPressRaycast() {
        return Il2Cpp.Api.PointerEventData._get_pointerPressRaycast(this.handle);
    }
    set_position(position) {
        return Il2Cpp.Api.PointerEventData._set_position(this.handle, position);
    }
    get_position() {
        return Il2Cpp.Api.PointerEventData._get_position(this.handle);
    }
    get_pressEventCamera() {
        return Il2Cpp.Api.PointerEventData._get_pressEventCamera(this.handle);
    }
    set_pressPosition(pressPosition) {
        return Il2Cpp.Api.PointerEventData._set_pressPosition(this.handle, pressPosition);
    }
    get_pressPosition() {
        return Il2Cpp.Api.PointerEventData._get_pressPosition(this.handle);
    }
    set_rawPointerPress(rawPointerPress) {
        return Il2Cpp.Api.PointerEventData._set_rawPointerPress(this.handle, rawPointerPress);
    }
    get_rawPointerPress() {
        return new Il2Cpp.GameObject(Il2Cpp.Api.PointerEventData._get_rawPointerPress(this.handle));
    }
    set_scrollDelta(scrollDelta) {
        return Il2Cpp.Api.PointerEventData._set_scrollDelta(this.handle, scrollDelta);
    }
    get_scrollDelta() {
        return Il2Cpp.Api.PointerEventData._get_scrollDelta(this.handle);
    }
    set_useDragThreshold(useDragThreshold) {
        return Il2Cpp.Api.PointerEventData._set_useDragThreshold(this.handle, useDragThreshold);
    }
    get_useDragThreshold() {
        return Il2Cpp.Api.PointerEventData._get_useDragThreshold(this.handle);
    }
    set_worldNormal(worldNormal) {
        return Il2Cpp.Api.PointerEventData._set_worldNormal(this.handle, worldNormal);
    }
    get_worldNormal() {
        return Il2Cpp.Api.PointerEventData._get_worldNormal(this.handle);
    }
    set_worldPosition(worldPosition) {
        return Il2Cpp.Api.PointerEventData._set_worldPosition(this.handle, worldPosition);
    }
    get_worldPosition() {
        return Il2Cpp.Api.PointerEventData._get_worldPosition(this.handle);
    }
}
exports.PointerEventImpl = PointerEventImpl;
},{"../class":21}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showEventData = void 0;
const class_1 = require("./class");
const showEventData = (eventData) => {
    LOGO(`${getLine(15)} EventData ${getLine(15)}`);
    let eventDataPack = new class_1.PointerEventImpl(eventData);
    let click_vector2 = allocVector();
    callFunction(find_method("UnityEngine.UI", "PointerEventData", "get_position", 0), click_vector2, eventData);
    LOGD("ClickPositon\t--->\t" + click_vector2.readFloat() + "\t" + click_vector2.add(p_size).readFloat());
    LOGD("clickTime\t--->\t" + eventDataPack.get_clickTime());
    LOGD("clickCount\t--->\t" + eventDataPack.get_clickCount());
    let delta_vector2 = allocVector();
    callFunction(find_method("UnityEngine.UI", "PointerEventData", "get_delta", 0), allocVector(), eventData);
    LOGD("delta\t\t--->\t" + delta_vector2.readFloat() + "\t" + delta_vector2.add(p_size).readFloat());
};
exports.showEventData = showEventData;
globalThis.showEventData = showEventData;
},{"./class":16}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./api");
require("./class");
require("./interface");
require("./export");
},{"./api":15,"./class":16,"./export":17,"./interface":19}],19:[function(require,module,exports){
"use strict";
// import { Vector3Impl } from "../../../ValueType/Vector3/class";
},{}],20:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEventDataAPI = void 0;
const decorator_cache_getter_1 = require("decorator-cache-getter");
class BaseEventDataAPI {
    static get _ctor_1() {
        // .ctor()
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.BaseEventData", ".ctor", 1, "void", ["pointer", "pointer"]);
    }
    static get _get_currentInputModule() {
        // get_currentInputModule() : BaseInputModule
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.BaseEventData", "get_currentInputModule", 0, "pointer", ["pointer"]);
    }
    static get _set_selectedObject() {
        // set_selectedObject(GameObject) : Void
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.BaseEventData", "set_selectedObject", 1, "void", ["pointer", "pointer"]);
    }
    static get _get_selectedObject() {
        // get_selectedObject() : GameObject
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.BaseEventData", "get_selectedObject", 0, "pointer", ["pointer"]);
    }
}
__decorate([
    decorator_cache_getter_1.cache
], BaseEventDataAPI, "_ctor_1", null);
__decorate([
    decorator_cache_getter_1.cache
], BaseEventDataAPI, "_get_currentInputModule", null);
__decorate([
    decorator_cache_getter_1.cache
], BaseEventDataAPI, "_set_selectedObject", null);
__decorate([
    decorator_cache_getter_1.cache
], BaseEventDataAPI, "_get_selectedObject", null);
exports.BaseEventDataAPI = BaseEventDataAPI;
Il2Cpp.Api.BaseEventData = BaseEventDataAPI;
},{"decorator-cache-getter":139}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEventDataImpl = void 0;
const class_1 = require("../../class");
const class_2 = require("../../Object/GameObject/class");
class BaseEventDataImpl extends class_1.mscorlib_System_Object_impl {
    ctor_1() {
        return new BaseEventDataImpl(Il2Cpp.Api.BaseEventData._ctor_1(alloc()));
    }
    get_currentInputModule() {
        return Il2Cpp.Api.BaseEventData._get_currentInputModule(this.handle);
    }
    set_selectedObject(gameObject) {
        return Il2Cpp.Api.BaseEventData._set_selectedObject(this.handle, gameObject.handle);
    }
    get_selectedObject() {
        return new class_2.GameObjectImpl(Il2Cpp.Api.BaseEventData._get_selectedObject(this.handle));
    }
}
exports.BaseEventDataImpl = BaseEventDataImpl;
},{"../../Object/GameObject/class":72,"../../class":112}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./PointerEventData/include");
require("./api");
require("./class");
require("./interface");
},{"./PointerEventData/include":18,"./api":20,"./class":21,"./interface":23}],23:[function(require,module,exports){
"use strict";
},{}],24:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractEventDataAPI = void 0;
const decorator_cache_getter_1 = require("decorator-cache-getter");
class AbstractEventDataAPI {
    static get _ctor_0() {
        // .ctor()
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.AbstractEventData", ".ctor", 0, "void", ["pointer"]);
    }
    static get _Reset() {
        // Reset() : Void
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.AbstractEventData", "Reset", 0, "void", ["pointer"]);
    }
    static get _Use() {
        // Use() : Void
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.AbstractEventData", "Use", 0, "void", ["pointer"]);
    }
    static get _get_used() {
        // get_used() : Boolean
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.EventSystems.AbstractEventData", "get_used", 0, "bool", ["pointer"]);
    }
}
__decorate([
    decorator_cache_getter_1.cache
], AbstractEventDataAPI, "_ctor_0", null);
__decorate([
    decorator_cache_getter_1.cache
], AbstractEventDataAPI, "_Reset", null);
__decorate([
    decorator_cache_getter_1.cache
], AbstractEventDataAPI, "_Use", null);
__decorate([
    decorator_cache_getter_1.cache
], AbstractEventDataAPI, "_get_used", null);
exports.AbstractEventDataAPI = AbstractEventDataAPI;
Il2Cpp.Api.AbstractEventData = AbstractEventDataAPI;
},{"decorator-cache-getter":139}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractEventDataImpl = void 0;
const class_1 = require("../class");
class AbstractEventDataImpl extends class_1.mscorlib_System_Object_impl {
    ctor_0() {
        return new AbstractEventDataImpl(Il2Cpp.Api.AbstractEventData._ctor_0(alloc()));
    }
    Reset() {
        return Il2Cpp.Api.AbstractEventData._Reset(this.handle);
    }
    Use() {
        return Il2Cpp.Api.AbstractEventData._Use(this.handle);
    }
    get_used() {
        return Il2Cpp.Api.AbstractEventData._get_used(this.handle);
    }
}
exports.AbstractEventDataImpl = AbstractEventDataImpl;
},{"../class":112}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./BaseEventData/include");
require("./api");
require("./class");
require("./interface");
},{"./BaseEventData/include":22,"./api":24,"./class":25,"./interface":27}],27:[function(require,module,exports){
"use strict";
},{}],28:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_cache_getter_1 = require("decorator-cache-getter");
class DebugAPI {
    static get _cctor() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Debug", ".cctor", 0, "pointer", ["pointer"]);
    }
    static get Break() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Debug", "Break", 0, "void", ["void"]);
    }
    static get DrawLine_3() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Debug", "DrawLine", 3, "void", ["pointer", "pointer", "pointer"]);
    }
    static get DrawLine_4() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Debug", "DrawLine", 4, "void", ["pointer", "pointer", "pointer", "float"]);
    }
    static get DrawLine_5() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Debug", "DrawLine", 5, "void", ["pointer", "pointer", "pointer", "float", "bool"]);
    }
    static get DrawRay_3() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Debug", "DrawRay", 3, "void", ["pointer", "pointer", "float"]);
    }
    static get DrawRay_4() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Debug", "DrawRay", 4, "void", ["pointer", "pointer", "float", "bool"]);
    }
    static get Log_1() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Debug", "Log", 1, "void", ["pointer"]);
    }
    static get Log_2() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Debug", "Log", 2, "void", ["pointer", "pointer"]);
    }
    static get LogAssertion_1() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Debug", "LogAssertion", 1, "void", ["pointer"]);
    }
    static get LogError_1() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Debug", "LogError", 1, "void", ["pointer"]);
    }
    static get LogError_2() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Debug", "LogError", 2, "void", ["pointer", "pointer"]);
    }
    static get LogErrorFormat_2() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Debug", "LogErrorFormat", 2, "void", ["pointer", "pointer"]);
    }
    static get LogException_1() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Debug", "LogException", 1, "void", ["pointer"]);
    }
    static get LogException_2() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Debug", "LogException", 2, "void", ["pointer", "pointer"]);
    }
    static get LogFormat_2() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Debug", "LogFormat", 2, "void", ["pointer", "pointer"]);
    }
    static get LogWarning_1() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Debug", "LogWarning", 1, "void", ["pointer"]);
    }
    static get LogWarning_2() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Debug", "LogWarning", 2, "void", ["pointer", "pointer"]);
    }
    static get LogWarningFormat_2() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Debug", "LogWarningFormat", 2, "void", ["pointer", "pointer"]);
    }
    static get get_isDebugBuild() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Debug", "get_isDebugBuild", 0, "bool", ["void"]);
    }
    static get get_unityLogger() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Debug", "get_unityLogger", 0, "pointer", ["void"]);
    }
}
__decorate([
    decorator_cache_getter_1.cache
], DebugAPI, "_cctor", null);
__decorate([
    decorator_cache_getter_1.cache
], DebugAPI, "Break", null);
__decorate([
    decorator_cache_getter_1.cache
], DebugAPI, "DrawLine_3", null);
__decorate([
    decorator_cache_getter_1.cache
], DebugAPI, "DrawLine_4", null);
__decorate([
    decorator_cache_getter_1.cache
], DebugAPI, "DrawLine_5", null);
__decorate([
    decorator_cache_getter_1.cache
], DebugAPI, "DrawRay_3", null);
__decorate([
    decorator_cache_getter_1.cache
], DebugAPI, "DrawRay_4", null);
__decorate([
    decorator_cache_getter_1.cache
], DebugAPI, "Log_1", null);
__decorate([
    decorator_cache_getter_1.cache
], DebugAPI, "Log_2", null);
__decorate([
    decorator_cache_getter_1.cache
], DebugAPI, "LogAssertion_1", null);
__decorate([
    decorator_cache_getter_1.cache
], DebugAPI, "LogError_1", null);
__decorate([
    decorator_cache_getter_1.cache
], DebugAPI, "LogError_2", null);
__decorate([
    decorator_cache_getter_1.cache
], DebugAPI, "LogErrorFormat_2", null);
__decorate([
    decorator_cache_getter_1.cache
], DebugAPI, "LogException_1", null);
__decorate([
    decorator_cache_getter_1.cache
], DebugAPI, "LogException_2", null);
__decorate([
    decorator_cache_getter_1.cache
], DebugAPI, "LogFormat_2", null);
__decorate([
    decorator_cache_getter_1.cache
], DebugAPI, "LogWarning_1", null);
__decorate([
    decorator_cache_getter_1.cache
], DebugAPI, "LogWarning_2", null);
__decorate([
    decorator_cache_getter_1.cache
], DebugAPI, "LogWarningFormat_2", null);
__decorate([
    decorator_cache_getter_1.cache
], DebugAPI, "get_isDebugBuild", null);
__decorate([
    decorator_cache_getter_1.cache
], DebugAPI, "get_unityLogger", null);
Il2Cpp.Api.Debug = DebugAPI;
},{"decorator-cache-getter":139}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HookDebugLog = void 0;
const HookDebugLog = () => {
    // public static void Log(object message)
    // A(find_method("UnityEngine.CoreModule", "Debug", "Log", 1, true), (args) => {
    //     LOG("\n[*] Debug.LOG('" + readU16(args[0]) + "')", LogColor.C36)
    // })
    // public void Log(LogType logType, object message)
    let addr_Log = find_method("UnityEngine.CoreModule", "Logger", "Log", 2, true);
    LOG("[*] Hook : UnityEngine.CoreModule.Logger.Log : " + addr_Log);
    A(addr_Log, (args, ctx) => {
        LOG("\n[*] Logger.LOG('" + args[1] + "\t" + readU16(args[2]) + "') LR : " + checkCtx(ctx, "LR"), LogColor.C32);
    });
    // public static void LogException(Exception exception)
    let addr_LogException = Il2Cpp.Api.Debug.LogException_2;
    LOG("[*] Hook : UnityEngine.CoreModule.Debug.LogException : " + addr_LogException);
    A(addr_LogException, (args) => {
        let retStr = callFunction(find_method("mscorlib", "Exception", "ToString", 0, true), args[0]);
        LOG("\n[*] Logger.LOG('" + readU16(retStr) + "')", LogColor.C36);
    });
};
exports.HookDebugLog = HookDebugLog;
globalThis.HookDebugLog = HookDebugLog;
},{}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./api");
require("./export");
},{"./api":28,"./export":29}],31:[function(require,module,exports){
"use strict";
},{}],32:[function(require,module,exports){
"use strict";
},{}],33:[function(require,module,exports){
"use strict";
},{}],34:[function(require,module,exports){
"use strict";
},{}],35:[function(require,module,exports){
"use strict";
},{}],36:[function(require,module,exports){
"use strict";
},{}],37:[function(require,module,exports){
"use strict";
},{}],38:[function(require,module,exports){
"use strict";
},{}],39:[function(require,module,exports){
"use strict";
},{}],40:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_cache_getter_1 = require("decorator-cache-getter");
require("./interface");
class ButtonAPI {
    static get _ctor() {
        // .ctor()
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.UI.Button", ".ctor", 0, "pointer", ["pointer"]);
    }
    static get _OnFinishSubmit() {
        // OnFinishSubmit() : IEnumerator
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.UI.Button", "OnFinishSubmit", 0, "pointer", ["pointer"]);
    }
    static get _OnPointerClick() {
        // OnPointerClick(PointerEventData) : Void
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.UI.Button", "OnPointerClick", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _OnSubmit() {
        // OnSubmit(BaseEventData) : Void
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.UI.Button", "OnSubmit", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _Press() {
        // Press() : Void
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.UI.Button", "Press", 0, "pointer", ["pointer"]);
    }
    static get _set_onClick() {
        // set_onClick(ButtonClickedEvent) : Void
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.UI.Button", "set_onClick", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _get_onClick() {
        // get_onClick() : ButtonClickedEvent
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.UI.Button", "get_onClick", 0, "pointer", ["pointer"]);
    }
}
__decorate([
    decorator_cache_getter_1.cache
], ButtonAPI, "_ctor", null);
__decorate([
    decorator_cache_getter_1.cache
], ButtonAPI, "_OnFinishSubmit", null);
__decorate([
    decorator_cache_getter_1.cache
], ButtonAPI, "_OnPointerClick", null);
__decorate([
    decorator_cache_getter_1.cache
], ButtonAPI, "_OnSubmit", null);
__decorate([
    decorator_cache_getter_1.cache
], ButtonAPI, "_Press", null);
__decorate([
    decorator_cache_getter_1.cache
], ButtonAPI, "_set_onClick", null);
__decorate([
    decorator_cache_getter_1.cache
], ButtonAPI, "_get_onClick", null);
Il2Cpp.Api.Button = ButtonAPI;
},{"./interface":44,"decorator-cache-getter":139}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonImpl = void 0;
const class_1 = require("../class");
class ButtonImpl extends class_1.SelectableImpl {
    ctor_0() {
        return new ButtonImpl(Il2Cpp.Api.Button._ctor(alloc()));
    }
    OnFinishSubmit() {
        return Il2Cpp.Api.Button._OnFinishSubmit(this.handle);
    }
    OnPointerClick(PointerEventData) {
        return Il2Cpp.Api.Button._OnPointerClick(this.handle, PointerEventData);
    }
    OnSubmit(BaseEventData) {
        return Il2Cpp.Api.Button._OnSubmit(this.handle, BaseEventData);
    }
    Press() {
        return Il2Cpp.Api.Button._Press(this.handle);
    }
    get_onClick() {
        return Il2Cpp.Api.Button._get_onClick(this.handle);
    }
    set_onClick(ButtonClickedEvent) {
        return Il2Cpp.Api.Button._set_onClick(this.handle, ButtonClickedEvent);
    }
}
exports.ButtonImpl = ButtonImpl;
Il2Cpp.Button = ButtonImpl;
},{"../class":46}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnButtonClick = exports.OnPointerClick = void 0;
const class_1 = require("../../../../../../AbstractEventData/BaseEventData/PointerEventData/class");
function OnPointerClick() {
    let funcAddr = undefined;
    switch (arguments[0]) {
        default:
            funcAddr = Il2Cpp.Api.Button._OnPointerClick;
            if (funcAddr == undefined || funcAddr.isNull())
                break;
            LOGE("\nEnable Hook OnPointerClick at " + funcAddr + "(" + funcAddr.sub(soAddr) + ")" + "\n");
            A(Il2Cpp.Api.Button._OnPointerClick, (args) => {
                LOGW("\n" + getLine(38));
                LOGD("public void OnPointerClick( " + args[0] + " , " + args[1] + " );");
                FakePointerEventData(args[1]);
            });
            break;
        case 0:
            funcAddr = find_method("UnityEngine.UI", "PointerInputModule", "DeselectIfSelectionChanged", 2);
            if (funcAddr.isNull())
                break;
            LOGE("\nEnable Hook DeselectIfSelectionChanged at " + funcAddr + "(" + funcAddr.sub(soAddr) + ")" + "\n");
            A(funcAddr, (args) => {
                LOGW("\n" + getLine(38));
                LOGD("protected void DeselectIfSelectionChanged(Ins = " + args[0] + " , GameObject = " + args[1] + " , BaseEventData(" + findClass("BaseEventData") + ") = " + args[2] + " );");
                if (!args[1].isNull())
                    showGameObject(args[1]);
            });
            break;
        case 1:
            funcAddr = find_method("UnityEngine.UI", "ScrollRect", "OnInitializePotentialDrag", 1);
            if (funcAddr.isNull())
                break;
            LOGE("\nEnable Hook OnInitializePotentialDrag at " + funcAddr + "(" + funcAddr.sub(soAddr) + ")" + "\n");
            A(funcAddr, (args) => {
                LOGW("\n" + getLine(38));
                LOGD("public void OnInitializePotentialDrag( " + args[0] + " , " + args[1] + " );");
                FakePointerEventData(args[1]);
            });
            break;
        case 2:
            A(find_method("UnityEngine.UI", "PointerInputModule", "ProcessMove", 1), (args) => {
                LOGW("\n" + getLine(38));
                LOGD("protected virtual Void ProcessMove( " + (args[1]) + " );");
                FakePointerEventData(args[1]);
            });
            break;
        case 3:
            A(find_method("UnityEngine.UI", "PointerInputModule", "ProcessDrag", 1), (args) => {
                LOGW("\n" + getLine(38));
                LOGD("protected virtual Void ProcessDrag( " + (args[1]) + " );");
                FakePointerEventData(args[1]);
            });
            break;
        case 4:
            A(find_method("UnityEngine.UI", "BaseInputModule", "HandlePointerExitAndEnter", 2), (args) => {
                LOGW("\n" + getLine(38));
                LOGD("protected virtual Void HandlePointerExitAndEnter( " + (args[1]) + " , " + (args[2]) + ")");
                FakePointerEventData(args[1]);
            });
            break;
        case 5:
            A(find_method("UnityEngine.UI", "PointerEventData", "set_pointerPress", 1), (args) => {
                LOGW("\n" + getLine(38));
                LOGD("protected virtual Void set_pointerPress( " + (args[1]) + " );");
                showGameObject(args[1]);
            });
            break;
        case 6:
            A(find_method("UnityEngine.UI", "PointerInputModule", "GetPointerData", 3), (args) => {
                LOGW("\n" + getLine(38));
                LOGD("protected virtual Void GetPointerData( " + (args[2]) + " );");
                showGameObject(args[1]);
                showEventData(args[2]);
            });
            break;
        case 7:
            // EventSystem --->  public Void RaycastAll (PointerEventData eventData,List`1 raycastResults)
            A(find_method("UnityEngine.UI", "EventSystem", "RaycastAll", 2), (args) => {
                LOGW("\n" + getLine(38));
                LOGD(`protected virtual Void RaycastAll( ${args[0]} , ${args[1]} , ${args[2]} );`);
                FakePointerEventData(args[1]);
            });
            break;
        case 8:
            // PointerInputModule --->  protected PointerEventData GetTouchPointerEventData (Touch input,Boolean pressed,Boolean released)
            A(find_method("UnityEngine.UI", "PointerInputModule", "GetTouchPointerEventData", 3), (args) => { }, (ret) => {
                LOGW("\n" + getLine(38));
                LOGD(`protected virtual Void GetTouchPointerEventData `);
                FakePointerEventData(ret);
            });
        case 9:
            // Selectable --->  public virtual Void OnPointerExit (PointerEventData eventData)
            A(find_method("UnityEngine.UI", "Selectable", "OnPointerExit", 1), (args) => {
                LOGW("\n" + getLine(38));
                LOGD("protected virtual Void OnPointerExit( " + (args[1]) + " );");
                FakePointerEventData(args[1]);
            });
            break;
    }
    function FakePointerEventData(eventData) {
        if (eventData.isNull())
            return;
        let gameObj = new class_1.PointerEventImpl(eventData).get_pointerEnter();
        if (!gameObj.handle.isNull())
            showGameObject(gameObj.handle);
        // showTransform(f_getTransform(gameObj))
        // showEventData(pointerEventData)
    }
}
exports.OnPointerClick = OnPointerClick;
const OnButtonClick = () => {
};
exports.OnButtonClick = OnButtonClick;
globalThis.HookOnPointerClick = OnPointerClick;
globalThis.B_Button = OnButtonClick;
},{"../../../../../../AbstractEventData/BaseEventData/PointerEventData/class":16}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./api");
require("./export");
require("./class");
require("./interface");
},{"./api":40,"./class":41,"./export":42,"./interface":44}],44:[function(require,module,exports){
"use strict";
},{}],45:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_cache_getter_1 = require("decorator-cache-getter");
require("./interface");
class SelectableAPI {
    static get _Awake() {
        // Awake() : Void
        return Il2Cpp.Api.t("UnityEngine.UI", "UnityEngine.UI.Selectable", "Awake", 0, "pointer", ["pointer"]);
    }
}
__decorate([
    decorator_cache_getter_1.cache
], SelectableAPI, "_Awake", null);
Il2Cpp.Api.Selectable = SelectableAPI;
},{"./interface":48,"decorator-cache-getter":139}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectableImpl = void 0;
const class_1 = require("../class");
class SelectableImpl extends class_1.MonoBehaviourImpl {
    Awake() {
        return Il2Cpp.Api.Selectable._Awake(this.handle);
    }
}
exports.SelectableImpl = SelectableImpl;
Il2Cpp.Selectable = SelectableImpl;
},{"../class":50}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./Button/include");
require("./class");
require("./interface");
require("./api");
},{"./Button/include":43,"./api":45,"./class":46,"./interface":48}],48:[function(require,module,exports){
"use strict";
},{}],49:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_cache_getter_1 = require("decorator-cache-getter");
require("./interface");
class MonoBehaviourAPI {
    static get _ctor() {
        // .ctor()
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.MonoBehaviour", ".ctor", 0, "pointer", ["pointer"]);
    }
    static get _CancelInvoke() {
        // CancelInvoke() : Void
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.MonoBehaviour", "CancelInvoke", 0, "void", ["pointer"]);
    }
    static get _CancelInvoke_String() {
        // CancelInvoke(String) : Void
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.MonoBehaviour", "CancelInvoke", 1, "void", ["pointer", "pointer"]);
    }
    static get _InvokeRepeating() {
        // InvokeRepeating(String, Single, Single) : Void
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.MonoBehaviour", "InvokeRepeating", 3, "void", ["pointer", "float", "float", "float"]);
    }
    static get _Invoke() {
        // Invoke(String, Single) : Void
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.MonoBehaviour", "Invoke", 2, "void", ["pointer", "float", "float"]);
    }
    static get _IsInvoking_String() {
        // IsInvoking(String) : Boolean
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.MonoBehaviour", "IsInvoking", 1, "bool", ["pointer", "pointer"]);
    }
    static get _IsInvoking_0() {
        // IsInvoking() : Boolean
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.MonoBehaviour", "IsInvoking", 0, "bool", ["pointer"]);
    }
    static get _print() {
        // print(Object) : Void
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.MonoBehaviour", "print", 1, "void", ["pointer", "pointer"]);
    }
    static get _StartCoroutine_IEnumerator() {
        // StartCoroutine(IEnumerator) : Coroutine
        return Il2Cpp.Api.o("UnityEngine.CoreModule", "UnityEngine.MonoBehaviour", "StartCoroutine", 1, ["System.Collections.IEnumerator"], "pointer", ["pointer", "pointer"]);
    }
    static get _StartCoroutine_String() {
        // StartCoroutine(String) : Coroutine
        return Il2Cpp.Api.o("UnityEngine.CoreModule", "UnityEngine.MonoBehaviour", "StartCoroutine", 1, ["System.String"], "pointer", ["pointer", "pointer"]);
    }
    static get _StartCoroutine_String_Object() {
        // StartCoroutine(String, Object) : Coroutine
        return Il2Cpp.Api.o("UnityEngine.CoreModule", "UnityEngine.MonoBehaviour", "StartCoroutine", 2, ["System.String", "System.Object"], "pointer", ["pointer", "pointer", "pointer"]);
    }
    static get _StartCoroutine_Auto() {
        // StartCoroutine_Auto(IEnumerator) : Coroutine
        return Il2Cpp.Api.o("UnityEngine.CoreModule", "UnityEngine.MonoBehaviour", "StartCoroutine_Auto", 1, ["System.Collections.IEnumerator"], "pointer", ["pointer", "pointer"]);
    }
    static get _StopAllCoroutines() {
        // StopAllCoroutines() : Void
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.MonoBehaviour", "StopAllCoroutines", 0, "void", ["pointer"]);
    }
    static get _StopCoroutine_Coroutine() {
        // StopCoroutine(Coroutine) : Void
        return Il2Cpp.Api.o("UnityEngine.CoreModule", "UnityEngine.MonoBehaviour", "StopCoroutine", 1, ["System.Collections.IEnumerator"], "void", ["pointer", "pointer"]);
    }
    static get _StopCoroutine_String() {
        // StopCoroutine(String) : Void
        return Il2Cpp.Api.o("UnityEngine.CoreModule", "UnityEngine.MonoBehaviour", "StopCoroutine", 1, ["System.String"], "void", ["pointer", "pointer"]);
    }
    static get _StopCoroutine_IEnumerator() {
        // StopCoroutine(IEnumerator) : Void
        return Il2Cpp.Api.o("UnityEngine.CoreModule", "UnityEngine.MonoBehaviour", "StopCoroutine", 1, ["System.Collections.IEnumerator"], "void", ["pointer", "pointer"]);
    }
    static get _set_useGUILayout() {
        // set_useGUILayout(Boolean) : Void
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.MonoBehaviour", "set_useGUILayout", 1, "void", ["pointer", "bool"]);
    }
    static get _get_useGUILayout() {
        // get_useGUILayout() : Boolean
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.MonoBehaviour", "get_useGUILayout", 0, "bool", ["pointer"]);
    }
}
__decorate([
    decorator_cache_getter_1.cache
], MonoBehaviourAPI, "_ctor", null);
__decorate([
    decorator_cache_getter_1.cache
], MonoBehaviourAPI, "_CancelInvoke", null);
__decorate([
    decorator_cache_getter_1.cache
], MonoBehaviourAPI, "_CancelInvoke_String", null);
__decorate([
    decorator_cache_getter_1.cache
], MonoBehaviourAPI, "_InvokeRepeating", null);
__decorate([
    decorator_cache_getter_1.cache
], MonoBehaviourAPI, "_Invoke", null);
__decorate([
    decorator_cache_getter_1.cache
], MonoBehaviourAPI, "_IsInvoking_String", null);
__decorate([
    decorator_cache_getter_1.cache
], MonoBehaviourAPI, "_IsInvoking_0", null);
__decorate([
    decorator_cache_getter_1.cache
], MonoBehaviourAPI, "_print", null);
__decorate([
    decorator_cache_getter_1.cache
], MonoBehaviourAPI, "_StartCoroutine_IEnumerator", null);
__decorate([
    decorator_cache_getter_1.cache
], MonoBehaviourAPI, "_StartCoroutine_String", null);
__decorate([
    decorator_cache_getter_1.cache
], MonoBehaviourAPI, "_StartCoroutine_String_Object", null);
__decorate([
    decorator_cache_getter_1.cache
], MonoBehaviourAPI, "_StartCoroutine_Auto", null);
__decorate([
    decorator_cache_getter_1.cache
], MonoBehaviourAPI, "_StopAllCoroutines", null);
__decorate([
    decorator_cache_getter_1.cache
], MonoBehaviourAPI, "_StopCoroutine_Coroutine", null);
__decorate([
    decorator_cache_getter_1.cache
], MonoBehaviourAPI, "_StopCoroutine_String", null);
__decorate([
    decorator_cache_getter_1.cache
], MonoBehaviourAPI, "_StopCoroutine_IEnumerator", null);
__decorate([
    decorator_cache_getter_1.cache
], MonoBehaviourAPI, "_set_useGUILayout", null);
__decorate([
    decorator_cache_getter_1.cache
], MonoBehaviourAPI, "_get_useGUILayout", null);
Il2Cpp.Api.MonoBehaviour = MonoBehaviourAPI;
},{"./interface":53,"decorator-cache-getter":139}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonoBehaviourImpl = void 0;
const class_1 = require("../../class");
class MonoBehaviourImpl extends class_1.ComponentImpl {
    ctor_0() {
        return new MonoBehaviourImpl(Il2Cpp.Api.MonoBehaviour._ctor(alloc()));
    }
    CancelInvoke_0() {
        return Il2Cpp.Api.MonoBehaviour._CancelInvoke(this.handle);
    }
    CancelInvoke_methodName(methodName) {
        return Il2Cpp.Api.MonoBehaviour._CancelInvoke_String(this.handle, allocCStr(methodName));
    }
    InvokeRepeating(methodName, time, repeatRate) {
        return Il2Cpp.Api.MonoBehaviour._InvokeRepeating(this.handle, allocCStr(methodName), time, repeatRate);
    }
    Invoke(methodName, time) {
        return Il2Cpp.Api.MonoBehaviour._Invoke(this.handle, allocCStr(methodName), time);
    }
    IsInvoking_methodName(methodName) {
        return Il2Cpp.Api.MonoBehaviour._IsInvoking_String(this.handle, allocCStr(methodName));
    }
    IsInvoking_0() {
        return Il2Cpp.Api.MonoBehaviour._IsInvoking_0(this.handle);
    }
    print(obj) {
        return Il2Cpp.Api.MonoBehaviour._print(this.handle, obj);
    }
    StartCoroutine_enumerator(enumerator) {
        return Il2Cpp.Api.MonoBehaviour._StartCoroutine_IEnumerator(this.handle, enumerator);
    }
    StartCoroutine_methodName(methodName) {
        return Il2Cpp.Api.MonoBehaviour._StartCoroutine_String(this.handle, allocCStr(methodName));
    }
    StartCoroutine_methodName_obj(methodName, obj) {
        return Il2Cpp.Api.MonoBehaviour._StartCoroutine_String_Object(this.handle, allocCStr(methodName), obj);
    }
    StartCoroutine_Auto(enumerator) {
        return Il2Cpp.Api.MonoBehaviour._StartCoroutine_Auto(this.handle, enumerator);
    }
    StopAllCoroutines() {
        return Il2Cpp.Api.MonoBehaviour._StopAllCoroutines(this.handle);
    }
    StopCoroutine_coroutine(coroutine) {
        return Il2Cpp.Api.MonoBehaviour._StopCoroutine_Coroutine(this.handle, coroutine);
    }
    StopCoroutine_methodName(methodName) {
        return Il2Cpp.Api.MonoBehaviour._StopCoroutine_String(this.handle, allocCStr(methodName));
    }
    StopCoroutine_enumerator(enumerator) {
        return Il2Cpp.Api.MonoBehaviour._StopCoroutine_IEnumerator(this.handle, enumerator);
    }
    set_useGUILayout(value) {
        return Il2Cpp.Api.MonoBehaviour._set_useGUILayout(this.handle, value);
    }
    get_useGUILayout() {
        return Il2Cpp.Api.MonoBehaviour._get_useGUILayout(this.handle);
    }
}
exports.MonoBehaviourImpl = MonoBehaviourImpl;
Il2Cpp.MonoBehaviour = MonoBehaviourImpl;
},{"../../class":67}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
},{}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./Selectable/include");
require("./api");
require("./class");
require("./export");
require("./interface");
},{"./Selectable/include":47,"./api":49,"./class":50,"./export":51,"./interface":53}],53:[function(require,module,exports){
"use strict";
},{}],54:[function(require,module,exports){
"use strict";
},{}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./Animation/include");
require("./Animator/include");
require("./AudioSourse/include");
require("./Camera/include");
require("./Light/include");
require("./MonoBehaviour/include");
require("./NetworkView/include");
},{"./Animation/include":35,"./Animator/include":36,"./AudioSourse/include":37,"./Camera/include":38,"./Light/include":39,"./MonoBehaviour/include":52,"./NetworkView/include":54}],56:[function(require,module,exports){
"use strict";
},{}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./CharacterController/include");
},{"./CharacterController/include":56}],58:[function(require,module,exports){
"use strict";
},{}],59:[function(require,module,exports){
"use strict";
},{}],60:[function(require,module,exports){
"use strict";
},{}],61:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_cache_getter_1 = require("decorator-cache-getter");
require("./interface");
class TransformAPI {
    static get _ctor() {
        // public extern Transform GetChild(int index);
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", ".ctor", 1, "pointer", ["pointer"]);
    }
    static get _GetChild() {
        // public extern Transform GetChild(int index);
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "GetChild", 1, "pointer", ["pointer", "int"]);
    }
    static get _IsChildOf() {
        // public extern bool IsChildOf([NotNull] Transform parent);
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "IsChildOf", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _LookAt() {
        // public void LookAt(Vector3 worldPosition)
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "LookAt", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _Rotate_eulers() {
        //public void Rotate(Vector3 eulers)
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "Rotate", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _Rotate_eulers_relativeTo() {
        // public void Rotate(Vector3 eulers, Space relativeTo)
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "Rotate", 2, "pointer", ["pointer", "pointer"]);
    }
    static get _Rotate_xAngle_yAngle_zAngle() {
        // public void Rotate(float xAngle, float yAngle, float zAngle)
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "Rotate", 3, "pointer", ["pointer", "float", "float", "float"]);
    }
    static get _SetAsFirstSibling() {
        // public extern void SetAsFirstSibling();
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "SetAsFirstSibling", 0, "pointer", ["pointer"]);
    }
    static get _SetParent() {
        // public void SetParent(Transform p)
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "SetParent", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _SetParent_parent_worldPositionStays() {
        // public extern void SetParent(Transform parent, bool worldPositionStays);
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "SetParent", 2, "pointer", ["pointer", "pointer", "bool"]);
    }
    static get _TransformDirection() {
        // public Vector3 TransformDirection(Vector3 direction)
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "TransformDirection", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _TransformPoint() {
        // public Vector3 TransformPoint(Vector3 position)
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "TransformPoint", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _get_childCount() {
        // public extern int get_childCount();
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "get_childCount", 0, "int", ["pointer"]);
    }
    static get _get_eulerAngles() {
        // public Vector3 get_eulerAngles()
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "get_eulerAngles", 0, "pointer", ["pointer", "pointer"]);
    }
    static get _get_forward() {
        // public Vector3 get_forward()
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "get_forward", 0, "pointer", ["pointer"]);
    }
    static get _set_localEulerAngles() {
        // public void set_localEulerAngles(Vector3 value)
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "set_localEulerAngles", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _get_localEulerAngles() {
        // public Vector3 get_localEulerAngles()
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "get_localEulerAngles", 0, "pointer", ["pointer"]);
    }
    static get _set_localPosition() {
        // public void set_localPosition(Vector3 value)
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "set_localPosition", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _get_localPosition() {
        // public Vector3 get_localPosition()
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "get_localPosition", 0, "pointer", ["pointer"]);
    }
    static get _set_localRotation() {
        // public void set_localRotation(Quaternion value)
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "set_localRotation", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _get_localRotation() {
        // public Quaternion get_localRotation()
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "get_localRotation", 0, "pointer", ["pointer"]);
    }
    static get _set_localScale() {
        // public void set_localScale(Vector3 value)
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "set_localScale", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _get_localScale() {
        // public Vector3 get_localScale()
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "get_localScale", 0, "pointer", ["pointer"]);
    }
    static get _get_localToWorldMatrix() {
        // public Matrix4x4 get_localToWorldMatrix()
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "get_localToWorldMatrix", 0, "pointer", ["pointer"]);
    }
    static get _set_parent() {
        // public void set_parent(Transform value)
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "set_parent", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _get_parent() {
        // public Transform get_parent()
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "get_parent", 0, "pointer", ["pointer"]);
    }
    static get _set_position() {
        // public void set_position(Vector3 value)
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "set_position", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _get_position() {
        // public Vector3 get_position()
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "get_position", 0, "pointer", ["pointer", "pointer"]);
    }
    static get _set_rotation() {
        // public void set_rotation(Quaternion value)
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "set_rotation", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _get_rotation() {
        // public Quaternion get_rotation()
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "get_rotation", 0, "pointer", ["pointer"]);
    }
    static get _get_up() {
        // public Vector3 get_up()
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "get_up", 0, "pointer", ["pointer"]);
    }
    static get _get_worldToLocalMatrix() {
        // public Matrix4x4 get_worldToLocalMatrix()
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Transform", "get_worldToLocalMatrix", 0, "pointer", ["pointer"]);
    }
}
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_ctor", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_GetChild", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_IsChildOf", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_LookAt", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_Rotate_eulers", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_Rotate_eulers_relativeTo", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_Rotate_xAngle_yAngle_zAngle", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_SetAsFirstSibling", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_SetParent", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_SetParent_parent_worldPositionStays", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_TransformDirection", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_TransformPoint", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_get_childCount", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_get_eulerAngles", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_get_forward", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_set_localEulerAngles", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_get_localEulerAngles", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_set_localPosition", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_get_localPosition", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_set_localRotation", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_get_localRotation", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_set_localScale", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_get_localScale", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_get_localToWorldMatrix", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_set_parent", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_get_parent", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_set_position", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_get_position", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_set_rotation", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_get_rotation", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_get_up", null);
__decorate([
    decorator_cache_getter_1.cache
], TransformAPI, "_get_worldToLocalMatrix", null);
Il2Cpp.Api.Transform = TransformAPI;
},{"./interface":65,"decorator-cache-getter":139}],62:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformImpl = void 0;
const class_1 = require("../../../ValueType/Vector3/class");
const class_2 = require("../class");
class TransformImpl extends class_2.ComponentImpl {
    ctor_0() {
        return new TransformImpl(Il2Cpp.Api.Transform._ctor(alloc()));
    }
    GetChild(index) {
        return new TransformImpl(Il2Cpp.Api.Transform._GetChild(this.handle, index));
    }
    GetEnumerator() {
        throw new Error("Method not implemented.");
    }
    GetParent() {
        return new TransformImpl(Il2Cpp.Api.Transform._get_parent(this.handle));
    }
    GetSiblingIndex() {
        throw new Error("Method not implemented.");
    }
    InverseTransformDirection(direction) {
        throw new Error("Method not implemented.");
    }
    InverseTransformPoint(position) {
        throw new Error("Method not implemented.");
    }
    InverseTransformVector(vector) {
        throw new Error("Method not implemented.");
    }
    IsChildOf(parent) {
        return Il2Cpp.Api.Transform._IsChildOf(this.handle, parent.handle);
    }
    // LookAt(target: Il2Cpp.Transform): void;
    // LookAt(target: Il2Cpp.Vector3): void;
    // LookAt(target: Il2Cpp.Transform, worldUp: Il2Cpp.Vector3): void;
    // LookAt(target: Il2Cpp.Vector3, worldUp: Il2Cpp.Vector3): void;
    // LookAt(target: unknown, worldUp?: unknown): void {
    //     throw new Error("Method not implemented.");
    // }
    // Rotate(eulerAngles: Il2Cpp.Vector3): void;
    // Rotate(eulerAngles: Il2Cpp.Vector3, relativeTo: Il2Cpp.Space): void;
    // Rotate(axis: Il2Cpp.Vector3, angle: number): void;
    // Rotate(axis: Il2Cpp.Vector3, angle: number, relativeTo: Il2Cpp.Space): void;
    // Rotate(x: number, y: number, z: number, relativeTo: Il2Cpp.Space): void;
    // Rotate(x: unknown, y?: unknown, z?: unknown, relativeTo?: unknown): void {
    //     throw new Error("Method not implemented.");
    // }
    RotateAround(point, axis, angle) {
        throw new Error("Method not implemented.");
    }
    SetAsFirstSibling() {
        throw new Error("Method not implemented.");
    }
    SetAsLastSibling() {
        throw new Error("Method not implemented.");
    }
    // SetParent(parent: Il2Cpp.Transform): void;
    // SetParent(parent: Il2Cpp.Transform, worldPositionStays: boolean): void;
    // SetParent(parent: unknown, worldPositionStays?: unknown): void {
    //     throw new Error("Method not implemented.");
    // }
    SetPositionAndRotation(position, rotation) {
        throw new Error("Method not implemented.");
    }
    SetSiblingIndex(index) {
        throw new Error("Method not implemented.");
    }
    TransformDirection(x, y, z) {
        throw new Error("Method not implemented.");
    }
    TransformPoint(position) {
        throw new Error("Method not implemented.");
    }
    TransformVector(vector) {
        throw new Error("Method not implemented.");
    }
    Translate(x, y, z, relativeTo) {
        throw new Error("Method not implemented.");
    }
    get_childCount() {
        return Il2Cpp.Api.Transform._get_childCount(this.handle);
    }
    get_eulerAngles() {
        let allocMem = alloc(4);
        Il2Cpp.Api.Transform._get_eulerAngles(this.handle, allocMem);
        return new Il2Cpp.Vector3(allocMem);
    }
    set_eulerAngles(value) {
        throw new Error("Method not implemented.");
    }
    get_forward() {
        return Il2Cpp.Api.Transform._get_forward(this.handle);
    }
    set_hasChanged(value) {
        throw new Error("Method not implemented.");
    }
    get_hasChanged() {
        throw new Error("Method not implemented.");
    }
    get_localEulerAngles() {
        return new Il2Cpp.Vector3(Il2Cpp.Api.Transform._get_localEulerAngles(this.handle));
    }
    set_localEulerAngles(value) {
        return Il2Cpp.Api.Transform._set_localEulerAngles(this.handle, value);
    }
    get_localPosition() {
        return new Il2Cpp.Vector3(Il2Cpp.Api.Transform._get_localPosition(this.handle));
    }
    set_localPosition(value) {
        return Il2Cpp.Api.Transform._set_localPosition(this.handle, value.handle);
    }
    get_localRotation() {
        return new Il2Cpp.Quaternion(Il2Cpp.Api.Transform._get_localRotation(this.handle));
    }
    set_localRotation(value) {
        return Il2Cpp.Api.Transform._set_localRotation(this.handle, value.handle);
    }
    get_localScale() {
        return new Il2Cpp.Vector3(Il2Cpp.Api.Transform._get_localScale(this.handle));
    }
    set_localScale(value) {
        return Il2Cpp.Api.Transform._set_localScale(this.handle, value.handle);
    }
    get_lossyScale() {
        throw new Error("Method not implemented.");
    }
    get_parent() {
        if (this.handle == ptr(0))
            return new Il2Cpp.Transform(ptr(0));
        return new Il2Cpp.Transform(Il2Cpp.Api.Transform._get_parent(this.handle));
    }
    set_parent(value) {
        return Il2Cpp.Api.Transform._set_parent(this.handle, value.handle);
    }
    get_position() {
        let allocMem = allocVector(0, 0, 0);
        Il2Cpp.Api.Transform._get_position(allocMem, this.handle);
        return new class_1.Vector3Impl(allocMem, 2);
    }
    set_position(value) {
        return Il2Cpp.Api.Transform._set_position(this.handle, value.handle);
    }
    get_right() {
        throw new Error("Method not implemented.");
    }
    get_rotation() {
        return new Il2Cpp.Quaternion(Il2Cpp.Api.Transform._get_rotation(this.handle));
    }
    set_rotation(value) {
        return Il2Cpp.Api.Transform._set_rotation(this.handle, value.handle);
    }
    get_up() {
        return new Il2Cpp.Vector3(Il2Cpp.Api.Transform._get_up(this.handle));
    }
    set_up(value) {
        throw new Error("Method not implemented.");
    }
}
exports.TransformImpl = TransformImpl;
Il2Cpp.Transform = TransformImpl;
},{"../../../ValueType/Vector3/class":109,"../class":67}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_1 = require("./class");
const showTransform = (transform) => {
    if (typeof transform == "number")
        transform = ptr(transform);
    LOGO(`${getLine(15)} Transform ${getLine(15)}`);
    let trsIns = new Il2Cpp.Transform(transform);
    LOGD(`childCount\t--->\t${trsIns.get_childCount()}\t(${trsIns.get_name()})`);
    PrintHierarchy(transform, 1, true);
    LOGD("get_position\t(" + trsIns.get_position().toString() + ")");
    // todo
};
/**
 * 打印transform往下的层级
 * ps:不建议打印底层的层级，展现一大篇出来毫无重点
 * @param {Number} mPtr Transform Pointer
 * @param {Number} level 最大显示层级
 * @param {Boolean} inCall 内部调用，去掉LOG的相关判断
 */
const PrintHierarchy = (mPtr, level = 2, inCall = false) => {
    if (typeof mPtr == "number")
        mPtr = ptr(mPtr);
    if (mPtr.isNull())
        return;
    let trsIns;
    if (getTypeName(mPtr) == "GameObject")
        mPtr = new Il2Cpp.GameObject(mPtr).get_transform().handle;
    trsIns = new Il2Cpp.Transform(mPtr);
    if (level == 10)
        LOGO(`${getLine(75)}\n`);
    // 当前level作为第一级
    let baseLevel = getLevel(trsIns);
    getChild(trsIns);
    if (level == 10)
        LOGO(`${getLine(75)}\n`);
    // 递归调用下层信息
    function getChild(trsInsLocal) {
        // LOGD(trsInsLocal.get_childCount())
        for (let index = 0; index < trsInsLocal.get_childCount(); ++index) {
            let child_transform = trsInsLocal.GetChild(index);
            let levelC = getLevel(child_transform) - baseLevel;
            // 这里可能出现 -1 -2 的情况，打出来一大片和当前transform无关的transform
            if (levelC > 0 && levelC <= level)
                LOGD((inCall != undefined ? "\t" : "") +
                    getLine(levelC - 1, "\t") +
                    child_transform.handle + " : " +
                    child_transform.get_name());
            getChild(child_transform);
        }
    }
    // 判断当前transform的层级
    function getLevel(trsInsLocal) {
        for (let level = 0; level < 10; ++level) {
            try {
                if (trsInsLocal.handle.isNull())
                    return level;
                trsInsLocal = trsInsLocal.get_parent();
            }
            catch (e) {
                return level;
            }
        }
        return 0;
    }
};
const getGameObject = (transform, inCall = false) => {
    if (typeof transform == "number")
        transform = ptr(transform);
    if (inCall) {
        showGameObject(transform);
    }
    else {
        return new class_1.TransformImpl(transform).get_gameObject().handle;
    }
};
globalThis.showTransform = showTransform;
globalThis.PrintHierarchy = PrintHierarchy;
globalThis.getGameObject = getGameObject;
},{"./class":62}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./api");
require("./export");
require("./class");
require("./interface");
},{"./api":61,"./class":62,"./export":63,"./interface":65}],65:[function(require,module,exports){
"use strict";
},{}],66:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_cache_getter_1 = require("decorator-cache-getter");
class ComponentAPI {
    static get _ctor_0() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Component", ".ctor", 0, "pointer", ["pointer"]);
    }
    static get _CompareTag() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Component", "CompareTag", 1, "bool", ["pointer", "pointer"]);
    }
    static get _GetComponent() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Component", "GetComponent", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _GetComponentInChildren() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Component", "GetComponentInChildren", 2, "pointer", ["pointer", "pointer", "bool"]);
    }
    static get _GetComponentInParent() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Component", "GetComponentInParent", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _GetComponents() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Component", "GetComponents", 2, "void", ["pointer", "pointer", "pointer"]);
    }
    static get _get_gameObject() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Component", "get_gameObject", 0, "pointer", ["pointer"]);
    }
    static get _set_tag() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Component", "set_tag", 1, "void", ["pointer", "pointer"]);
    }
    static get _get_transform() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Component", "get_transform", 0, "pointer", ["pointer"]);
    }
}
__decorate([
    decorator_cache_getter_1.cache
], ComponentAPI, "_ctor_0", null);
__decorate([
    decorator_cache_getter_1.cache
], ComponentAPI, "_CompareTag", null);
__decorate([
    decorator_cache_getter_1.cache
], ComponentAPI, "_GetComponent", null);
__decorate([
    decorator_cache_getter_1.cache
], ComponentAPI, "_GetComponentInChildren", null);
__decorate([
    decorator_cache_getter_1.cache
], ComponentAPI, "_GetComponentInParent", null);
__decorate([
    decorator_cache_getter_1.cache
], ComponentAPI, "_GetComponents", null);
__decorate([
    decorator_cache_getter_1.cache
], ComponentAPI, "_get_gameObject", null);
__decorate([
    decorator_cache_getter_1.cache
], ComponentAPI, "_set_tag", null);
__decorate([
    decorator_cache_getter_1.cache
], ComponentAPI, "_get_transform", null);
Il2Cpp.Api.Component = ComponentAPI;
},{"decorator-cache-getter":139}],67:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentImpl = void 0;
const class_1 = require("../class");
class ComponentImpl extends class_1.ObjectIl2cpp_impl {
    __ctor__() {
        return new Il2Cpp.Component(Il2Cpp.Api.Component._ctor_0(this.handle, allocP(1)));
    }
    CompareTag(tag) {
        return Il2Cpp.Api.Component._CompareTag(this.handle, allocUStr(tag));
    }
    GetComponent(type) {
        return new Il2Cpp.Component(Il2Cpp.Api.Component._GetComponent(this.handle, type));
    }
    GetComponentInChildren(t, includeInactive) {
        return new Il2Cpp.Component(Il2Cpp.Api.Component._GetComponentInChildren(this.handle, t.handle, includeInactive));
    }
    GetComponentInParent(t) {
        return new Il2Cpp.Component(Il2Cpp.Api.Component._GetComponentInParent(this.handle, t.handle));
    }
    GetComponents(type, results) {
        return Il2Cpp.Api.Component._GetComponents(this.handle, type, results);
    }
    get_gameObject() {
        return new Il2Cpp.GameObject(Il2Cpp.Api.Component._get_gameObject(this.handle));
    }
    set_tag(value) {
        return Il2Cpp.Api.Component._set_tag(this.handle, allocUStr(value));
    }
    get_transform() {
        return Il2Cpp.Api.Component._get_transform(this.handle);
    }
}
exports.ComponentImpl = ComponentImpl;
Il2Cpp.Component = ComponentImpl;
},{"../class":82}],68:[function(require,module,exports){
"use strict";
},{}],69:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./Behavior/include");
require("./Collider/include");
require("./ParticleSystem/include");
require("./Rigidbody/include");
require("./Renderer/include");
require("./Transform/include");
require("./api");
require("./class");
require("./export");
require("./interface");
},{"./Behavior/include":55,"./Collider/include":57,"./ParticleSystem/include":58,"./Renderer/include":59,"./Rigidbody/include":60,"./Transform/include":64,"./api":66,"./class":67,"./export":68,"./interface":70}],70:[function(require,module,exports){
"use strict";
},{}],71:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_cache_getter_1 = require("decorator-cache-getter");
class GameObjectAPI {
    static get _ctor_0() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.GameObject", ".ctor", 0, "pointer", ["pointer"]);
    }
    static get _ctor_1() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.GameObject", ".ctor", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _ctor_2() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.GameObject", ".ctor", 2, "pointer", ["pointer", "pointer", "pointer"]);
    }
    static get _AddComponent() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.GameObject", "AddComponent", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _GetComponent() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.GameObject", "GetComponent", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _GetComponentInChildren() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.GameObject", "GetComponentInChildren", 2, "pointer", ["pointer", "pointer", "pointer"]);
    }
    static get _GetComponentInParent() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.GameObject", "GetComponentInParent", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _GetComponentsInternal() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.GameObject", "GetComponentsInternal", 6, "pointer", ["pointer", "pointer", "pointer", "pointer", "pointer", "pointer", "pointer"]);
    }
    static get _SendMessage() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.GameObject", "SendMessage", 2, "pointer", ["pointer", "pointer", "pointer"]);
    }
    static get _SetActive() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.GameObject", "SetActive", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _GetComponentFastPath() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.GameObject", "TryGetComponentFastPath", 2, "pointer", ["pointer", "pointer"]);
    }
    static get _CompareTag() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.GameObject", "CompareTag", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _get_transform() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.GameObject", "get_transform", 0, "pointer", ["pointer"]);
    }
    static get _get_tag() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.GameObject", "get_tag", 0, "pointer", ["pointer"]);
    }
    static get _get_layer() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.GameObject", "get_layer", 0, "pointer", ["pointer"]);
    }
    static get _set_layer() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.GameObject", "set_layer", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _get_gameObject() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.GameObject", "get_gameObject", 0, "pointer", ["pointer"]);
    }
    static get _get_activeSelf() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.GameObject", "get_activeSelf", 0, "bool", ["pointer"]);
    }
    static get _Find() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.GameObject", "Find", 1, "pointer", ["pointer"]);
    }
    static get _FindGameObjectsWithTag_A() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.GameObject", "FindGameObjectsWithTag", 1, "pointer", ["pointer"]);
    }
    static get _FindGameObjectWithTag() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.GameObject", "FindGameObjectWithTag", 1, "pointer", ["pointer"]);
    }
    static get _FindWithTag() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.GameObject", "FindWithTag", 1, "pointer", ["pointer"]);
    }
}
__decorate([
    decorator_cache_getter_1.cache
], GameObjectAPI, "_ctor_0", null);
__decorate([
    decorator_cache_getter_1.cache
], GameObjectAPI, "_ctor_1", null);
__decorate([
    decorator_cache_getter_1.cache
], GameObjectAPI, "_ctor_2", null);
__decorate([
    decorator_cache_getter_1.cache
], GameObjectAPI, "_AddComponent", null);
__decorate([
    decorator_cache_getter_1.cache
], GameObjectAPI, "_GetComponent", null);
__decorate([
    decorator_cache_getter_1.cache
], GameObjectAPI, "_GetComponentInChildren", null);
__decorate([
    decorator_cache_getter_1.cache
], GameObjectAPI, "_GetComponentInParent", null);
__decorate([
    decorator_cache_getter_1.cache
], GameObjectAPI, "_GetComponentsInternal", null);
__decorate([
    decorator_cache_getter_1.cache
], GameObjectAPI, "_SendMessage", null);
__decorate([
    decorator_cache_getter_1.cache
], GameObjectAPI, "_SetActive", null);
__decorate([
    decorator_cache_getter_1.cache
], GameObjectAPI, "_GetComponentFastPath", null);
__decorate([
    decorator_cache_getter_1.cache
], GameObjectAPI, "_CompareTag", null);
__decorate([
    decorator_cache_getter_1.cache
], GameObjectAPI, "_get_transform", null);
__decorate([
    decorator_cache_getter_1.cache
], GameObjectAPI, "_get_tag", null);
__decorate([
    decorator_cache_getter_1.cache
], GameObjectAPI, "_get_layer", null);
__decorate([
    decorator_cache_getter_1.cache
], GameObjectAPI, "_set_layer", null);
__decorate([
    decorator_cache_getter_1.cache
], GameObjectAPI, "_get_gameObject", null);
__decorate([
    decorator_cache_getter_1.cache
], GameObjectAPI, "_get_activeSelf", null);
__decorate([
    decorator_cache_getter_1.cache
], GameObjectAPI, "_Find", null);
__decorate([
    decorator_cache_getter_1.cache
], GameObjectAPI, "_FindGameObjectsWithTag_A", null);
__decorate([
    decorator_cache_getter_1.cache
], GameObjectAPI, "_FindGameObjectWithTag", null);
__decorate([
    decorator_cache_getter_1.cache
], GameObjectAPI, "_FindWithTag", null);
Il2Cpp.Api.GameObject = GameObjectAPI;
},{"decorator-cache-getter":139}],72:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameObjectImpl = void 0;
const class_1 = require("../class");
class GameObjectImpl extends class_1.ObjectIl2cpp_impl {
    constructor(handle) {
        super(handle);
    }
    ctor_0() {
        return new Il2Cpp.GameObject(Il2Cpp.Api.GameObject._ctor_0(allocP(1)));
    }
    ctor_1(name) {
        return new Il2Cpp.GameObject(Il2Cpp.Api.GameObject._ctor_1(allocP(1), allocUStr(name)));
    }
    ctor_2(name, type) {
        let types = Il2Cpp.Array.from(type[0].class, type.length);
        return Il2Cpp.Api.GameObject._ctor_2(this.handle, allocP(1), allocUStr(name), types);
    }
    AddComponent(componentType) {
        return Il2Cpp.Api.GameObject._AddComponent(this.handle, componentType);
    }
    GetComponent(type) {
        return Il2Cpp.Api.GameObject._GetComponent(this.handle, type);
    }
    GetComponentInChildren(type, includeInactive) {
        return Il2Cpp.Api.GameObject._GetComponentInChildren(this.handle, type.handle, ptr(includeInactive));
    }
    GetComponentInParent(type, includeInactive) {
        return Il2Cpp.Api.GameObject._GetComponentInParent(this.handle, type.handle, ptr(includeInactive));
    }
    GetComponentsInternal(type, useSearchTypeAsArrayReturnType, recursive, includeInactive, reverse, resultList) {
        return Il2Cpp.Api.GameObject._GetComponentsInternal(this.handle, type.handle, ptr(useSearchTypeAsArrayReturnType), ptr(recursive), ptr(includeInactive), ptr(reverse), ptr(resultList));
    }
    SendMessage(methodName, options) {
        return Il2Cpp.Api.GameObject._SendMessage(this.handle, allocUStr(methodName), options);
    }
    SetActive(value) {
        return Il2Cpp.Api.GameObject._SetActive(this.handle, ptr(value));
    }
    GetComponentFastPath(type, oneFurtherThanResultValue) {
        return Il2Cpp.Api.GameObject._GetComponentFastPath(this.handle, type, oneFurtherThanResultValue);
    }
    CompareTag(tag) {
        return Il2Cpp.Api.GameObject._CompareTag(this.handle, allocUStr(tag));
    }
    get_transform() {
        if (this.handle == ptr(0))
            throw new Error("get_transform : GameObject is null");
        return new Il2Cpp.Transform(Il2Cpp.Api.GameObject._get_transform(this.handle));
    }
    get_tag() {
        return Il2Cpp.Api.GameObject._get_tag(this.handle);
    }
    set_layer(value) {
        return Il2Cpp.Api.GameObject._set_layer(this.handle, ptr(value));
    }
    get_layer() {
        return Il2Cpp.Api.GameObject._get_layer(this.handle);
    }
    get_gameObject() {
        return new Il2Cpp.GameObject(Il2Cpp.Api.GameObject._get_gameObject(this.handle));
    }
    get_activeSelf() {
        return Il2Cpp.Api.GameObject._get_activeSelf(this.handle);
    }
    get_activeInHierarchy() {
        return Il2Cpp.Api.GameObject._get_activeSelf(this.handle);
    }
    // public static extern GameObject Find(string name);
    static Find(name) {
        return new Il2Cpp.GameObject(Il2Cpp.Api.GameObject._Find(allocUStr(name)));
    }
    // public static extern GameObject[] FindGameObjectsWithTag(string tag);
    static FindGameObjectsWithTag_A(tag) {
        return new Il2Cpp.GameObject(Il2Cpp.Api.GameObject._FindGameObjectsWithTag_A(allocUStr(tag)));
    }
    // public static extern GameObject FindGameObjectWithTag(string tag);
    static FindGameObjectWithTag(tag) {
        return new Il2Cpp.GameObject(Il2Cpp.Api.GameObject._FindGameObjectWithTag(allocUStr(tag)));
    }
    // public static GameObject FindWithTag(string tag)
    static FindWithTag(tag) {
        return new Il2Cpp.GameObject(Il2Cpp.Api.GameObject._FindWithTag(allocUStr(tag)));
    }
}
exports.GameObjectImpl = GameObjectImpl;
Il2Cpp.GameObject = GameObjectImpl;
},{"../class":82}],73:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showGameObject = void 0;
const common_1 = require("../../../../../utils/common");
const HookSetActive = (defaltActive = 1) => {
    A(Il2Cpp.Api.GameObject._SetActive, (args, ctx, passValue) => {
        if (args[0].isNull())
            return;
        let gameObject = new Il2Cpp.GameObject(args[0]);
        if ((0, common_1.filterDuplicateOBJ)(gameObject.toString()) == -1)
            return;
        if (defaltActive == 2 || args[1].toInt32() == defaltActive) {
            let strTmp = "public extern void SetActive( " + (args[1].toInt32() == 0 ? "false" : "true") + " );  LR:" + checkCtx(ctx);
            LOGW("\n" + getLine(strTmp.length));
            LOGD(strTmp);
            LOGO(getLine(strTmp.length / 2));
            showGameObject(args[0]);
        }
    });
};
function showGameObject(mPtr) {
    if (typeof mPtr == "number")
        mPtr = ptr(mPtr);
    let gameObject;
    if (getTypeName(mPtr) == "GameObject") {
        gameObject = new Il2Cpp.GameObject(mPtr);
    }
    else if (getTypeName(mPtr) == "RectTransform") {
        gameObject = new Il2Cpp.Transform(mPtr).get_gameObject();
    }
    else {
        throw new Error("showGameObject: mPtr is not GameObject or Transform");
    }
    LOGO("--------- GameObject ---------");
    LOGD("gameObj\t\t--->\t" + gameObject.handle);
    LOGD("getName\t\t--->\t" + gameObject.get_name());
    LOGD("getLayer\t--->\t" + gameObject.get_layer());
    let m_transform = gameObject.get_transform();
    LOGD("getTransform\t--->\t" + m_transform.handle);
    let layerNames = "";
    for (var i = 0; i < 10; i++) {
        if (m_transform.handle.isNull())
            break;
        let getName = m_transform.get_gameObject().get_name();
        let handle = m_transform.handle;
        let spl = layerNames == "" ? "" : " <--- ";
        layerNames = layerNames + spl + getName + "(" + handle + ")";
        m_transform = m_transform.get_parent();
    }
    LOGD("hierarchy\t--->\t" + layerNames);
}
exports.showGameObject = showGameObject;
globalThis.HookSetActive = HookSetActive;
globalThis.showGameObject = showGameObject;
},{"../../../../../utils/common":132}],74:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./api");
require("./class");
require("./export");
require("./interface");
},{"./api":71,"./class":72,"./export":73,"./interface":75}],75:[function(require,module,exports){
"use strict";
},{}],76:[function(require,module,exports){
"use strict";
},{}],77:[function(require,module,exports){
"use strict";
},{}],78:[function(require,module,exports){
"use strict";
},{}],79:[function(require,module,exports){
"use strict";
},{}],80:[function(require,module,exports){
"use strict";
},{}],81:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.il2cppObjAPI = void 0;
const decorator_cache_getter_1 = require("decorator-cache-getter");
class il2cppObjAPI {
    static get _ctor_0() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Object", ".ctor", 0, "pointer", ["pointer"]);
    }
    static get _GetHashCode() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Object", "GetHashCode", 0, "int32", ["pointer"]);
    }
    static get _GetInstanceID() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Object", "GetInstanceID", 0, "int32", ["pointer"]);
    }
    static get _ToString() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Object", "ToString", 0, "pointer", ["pointer"]);
    }
    static get _set_name() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Object", "set_name", 1, "void", ["pointer", "pointer"]);
    }
    static get _get_name() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Object", "get_name", 0, "pointer", ["pointer"]);
    }
    static get _Equals() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Object", "Equals", 1, "bool", ["pointer"]);
    }
    // static methods ↓
    static get _Destroy_1() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Object", "Destroy", 1, "void", ["pointer"]);
    }
    static get _Destroy_2() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Object", "Destroy", 2, "void", ["pointer", "float"]);
    }
    static get _DestroyImmediate() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Object", "DestroyImmediate", 1, "void", ["pointer"]);
    }
}
__decorate([
    decorator_cache_getter_1.cache
], il2cppObjAPI, "_ctor_0", null);
__decorate([
    decorator_cache_getter_1.cache
], il2cppObjAPI, "_GetHashCode", null);
__decorate([
    decorator_cache_getter_1.cache
], il2cppObjAPI, "_GetInstanceID", null);
__decorate([
    decorator_cache_getter_1.cache
], il2cppObjAPI, "_ToString", null);
__decorate([
    decorator_cache_getter_1.cache
], il2cppObjAPI, "_set_name", null);
__decorate([
    decorator_cache_getter_1.cache
], il2cppObjAPI, "_get_name", null);
__decorate([
    decorator_cache_getter_1.cache
], il2cppObjAPI, "_Equals", null);
__decorate([
    decorator_cache_getter_1.cache
], il2cppObjAPI, "_Destroy_1", null);
__decorate([
    decorator_cache_getter_1.cache
], il2cppObjAPI, "_Destroy_2", null);
__decorate([
    decorator_cache_getter_1.cache
], il2cppObjAPI, "_DestroyImmediate", null);
exports.il2cppObjAPI = il2cppObjAPI;
Il2Cpp.Api.il2cppObj = il2cppObjAPI;
},{"decorator-cache-getter":139}],82:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectIl2cpp_impl = void 0;
class il2cppObjAPI_impl extends Il2Cpp.Object {
    ctor() {
        return Il2Cpp.Api.il2cppObj._ctor_0(allocP(1));
    }
    Equals(other) {
        return Il2Cpp.Api.il2cppObj._Equals(this.handle, other.handle);
    }
    GetHashCode() {
        return Il2Cpp.Api.il2cppObj._GetHashCode(this.handle);
    }
    GetInstanceID() {
        return Il2Cpp.Api.il2cppObj._GetInstanceID(this.handle);
    }
    ToString() {
        return Il2Cpp.Api.il2cppObj._ToString(this.handle);
    }
    set_name(value) {
        return Il2Cpp.Api.il2cppObj._set_name(this.handle, allocUStr(value));
    }
    get_name() {
        return readU16(Il2Cpp.Api.il2cppObj._get_name(this.handle));
    }
    static Destroy_1(obj) {
        return Il2Cpp.Api.il2cppObj._Destroy_1(obj);
    }
    static Destroy_2(obj, t) {
        return Il2Cpp.Api.il2cppObj._Destroy_2(obj, t);
    }
    static DestroyImmediate(obj) {
        return Il2Cpp.Api.il2cppObj._DestroyImmediate(obj);
    }
}
class ObjectIl2cpp_impl extends il2cppObjAPI_impl {
}
exports.ObjectIl2cpp_impl = ObjectIl2cpp_impl;
},{}],83:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./api");
require("./class");
require("./interface");
require("./AssetBundle/include");
require("./Avatar/include");
require("./Component/include");
require("./GameObject/include");
require("./Material/include");
require("./Mesh/include");
require("./Montion/include");
require("./Shader/include");
require("./Sprite/include");
},{"./AssetBundle/include":33,"./Avatar/include":34,"./Component/include":69,"./GameObject/include":74,"./Material/include":76,"./Mesh/include":77,"./Montion/include":78,"./Shader/include":79,"./Sprite/include":80,"./api":81,"./class":82,"./interface":84}],84:[function(require,module,exports){
"use strict";
},{}],85:[function(require,module,exports){
"use strict";
},{}],86:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_cache_getter_1 = require("decorator-cache-getter");
class PlayerPrefsAPI {
    static get _DeleteAll() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.PlayerPrefs", "DeleteAll", 0, "pointer", ["pointer"]);
    }
    static get _DeleteKey() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.PlayerPrefs", "DeleteKey", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _GetFloat() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.PlayerPrefs", "GetFloat", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _GetFloat_2() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.PlayerPrefs", "GetFloat", 2, "pointer", ["pointer", "pointer", "pointer"]);
    }
    static get _GetInt() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.PlayerPrefs", "GetInt", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _GetInt_2() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.PlayerPrefs", "GetInt", 2, "pointer", ["pointer", "pointer", "pointer"]);
    }
    static get _GetString() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.PlayerPrefs", "GetString", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _GetString_2() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.PlayerPrefs", "GetString", 2, "pointer", ["pointer", "pointer", "pointer"]);
    }
    static get _HasKey() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.PlayerPrefs", "HasKey", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _Save() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.PlayerPrefs", "Save", 0, "pointer", ["pointer"]);
    }
    static get _SetFloat() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.PlayerPrefs", "SetFloat", 2, "pointer", ["pointer", "pointer", "pointer"]);
    }
    static get _SetInt() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.PlayerPrefs", "SetInt", 2, "pointer", ["pointer", "pointer", "pointer"]);
    }
    static get _SetString() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.PlayerPrefs", "SetString", 2, "pointer", ["pointer", "pointer", "pointer"]);
    }
}
__decorate([
    decorator_cache_getter_1.cache
], PlayerPrefsAPI, "_DeleteAll", null);
__decorate([
    decorator_cache_getter_1.cache
], PlayerPrefsAPI, "_DeleteKey", null);
__decorate([
    decorator_cache_getter_1.cache
], PlayerPrefsAPI, "_GetFloat", null);
__decorate([
    decorator_cache_getter_1.cache
], PlayerPrefsAPI, "_GetFloat_2", null);
__decorate([
    decorator_cache_getter_1.cache
], PlayerPrefsAPI, "_GetInt", null);
__decorate([
    decorator_cache_getter_1.cache
], PlayerPrefsAPI, "_GetInt_2", null);
__decorate([
    decorator_cache_getter_1.cache
], PlayerPrefsAPI, "_GetString", null);
__decorate([
    decorator_cache_getter_1.cache
], PlayerPrefsAPI, "_GetString_2", null);
__decorate([
    decorator_cache_getter_1.cache
], PlayerPrefsAPI, "_HasKey", null);
__decorate([
    decorator_cache_getter_1.cache
], PlayerPrefsAPI, "_Save", null);
__decorate([
    decorator_cache_getter_1.cache
], PlayerPrefsAPI, "_SetFloat", null);
__decorate([
    decorator_cache_getter_1.cache
], PlayerPrefsAPI, "_SetInt", null);
__decorate([
    decorator_cache_getter_1.cache
], PlayerPrefsAPI, "_SetString", null);
Il2Cpp.Api.PlayerPrefs = PlayerPrefsAPI;
},{"decorator-cache-getter":139}],87:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerPrefsImpl = void 0;
const class_1 = require("../Object/class");
class PlayerPrefsImpl extends class_1.ObjectIl2cpp_impl {
    DeleteAll() {
        return Il2Cpp.Api.PlayerPrefs._DeleteAll(this.handle);
    }
    DeleteKey(key) {
        return Il2Cpp.Api.PlayerPrefs._DeleteKey(this.handle, allocCStr(key));
    }
    GetFloat(key) {
        return Il2Cpp.Api.PlayerPrefs._GetFloat(this.handle, allocCStr(key));
    }
    GetFloat_2(key, defaultValue = 0) {
        return Il2Cpp.Api.PlayerPrefs._GetFloat_2(this.handle, allocCStr(key), defaultValue);
    }
    GetInt(key) {
        return Il2Cpp.Api.PlayerPrefs._GetInt(this.handle, allocCStr(key));
    }
    GetInt_2(key, defaultValue = 0) {
        return Il2Cpp.Api.PlayerPrefs._GetInt_2(this.handle, allocCStr(key), defaultValue);
    }
    GetString(key) {
        return Il2Cpp.Api.PlayerPrefs._GetString(this.handle, allocCStr(key));
    }
    GetString_2(key, defaultValue = "") {
        return Il2Cpp.Api.PlayerPrefs._GetString_2(this.handle, allocCStr(key), allocCStr(defaultValue));
    }
    HasKey(key) {
        return Il2Cpp.Api.PlayerPrefs._HasKey(this.handle, allocCStr(key));
    }
    Save() {
        return Il2Cpp.Api.PlayerPrefs._Save(this.handle);
    }
    SetFloat(key, value = 0) {
        return Il2Cpp.Api.PlayerPrefs._SetFloat(this.handle, allocCStr(key), value);
    }
    SetInt(key, value = 0) {
        return Il2Cpp.Api.PlayerPrefs._SetInt(this.handle, allocCStr(key), value);
    }
    SetString(key, value = "") {
        return Il2Cpp.Api.PlayerPrefs._SetString(this.handle, allocCStr(key), allocCStr(value));
    }
}
exports.PlayerPrefsImpl = PlayerPrefsImpl;
Il2Cpp.PlayerPrefs = PlayerPrefsImpl;
},{"../Object/class":82}],88:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HookPlayerPrefs = void 0;
const HookPlayerPrefs = (isShowPrintStack = false, needLRInfo = true) => {
    InterceptorGetFunctions();
    InterceptorSetFunctions();
    function InterceptorGetFunctions() {
        //public static extern float GetFloat(string key, float defaultValue)
        A(Il2Cpp.Api.PlayerPrefs._GetFloat_2, (args, ctx, pass) => {
            pass.set("arg0", readU16(args[0]));
            pass.set("arg1", args[1]);
        }, (retval, ctx, pass) => {
            LOGD("\n[*] '" + retval + "' = GetFloat('" + pass.get("arg0") + "'," + pass.get("arg1") + ")");
            if (needLRInfo)
                LOGZ("\t\t { LR:" + checkCtx(ctx) + " } | { PC:" + checkCtx(ctx, "PC") + " }");
            if (isShowPrintStack)
                LOGZ((GetStackTraceN(ctx)));
        });
        //public static extern int GetInt(string key, int defaultValue)
        A(Il2Cpp.Api.PlayerPrefs._GetInt_2, (args, ctx, pass) => {
            pass.set("arg0", readU16(args[0]));
            pass.set("arg1", args[1]);
        }, (retval, ctx, pass) => {
            LOGD("\n[*] '" + retval.toInt32() + "' = GetInt('" + pass.get("arg0") + "'," + pass.get("arg1") + ")");
            if (needLRInfo)
                LOGZ("\t\t { LR:" + checkCtx(ctx) + " } | { PC:" + checkCtx(ctx, "PC") + " }");
            if (isShowPrintStack)
                LOGZ((GetStackTraceN(ctx)));
            if (pass.get("arg0").indexOf("SaleBoughted") != -1)
                retval.replace(ptr(0x1));
        });
        //public static string GetString(string key)
        A(Il2Cpp.Api.PlayerPrefs._GetString, (args, ctx, pass) => {
            pass.set("arg0", readU16(args[0]));
        }, (retval, ctx, pass) => {
            LOGD("\n[*] '" + readU16(retval) + "' = GetString('" + pass.get("arg0") + "')");
            if (needLRInfo)
                LOGZ("\t\t { LR:" + checkCtx(ctx) + " } | { PC:" + checkCtx(ctx, "PC") + " }");
            if (isShowPrintStack)
                LOGZ((GetStackTraceN(ctx)));
        });
    }
    function InterceptorSetFunctions() {
        //public static extern float GetFloat(string key, float defaultValue)
        A(Il2Cpp.Api.PlayerPrefs._SetFloat, (args, ctx, pass) => {
            pass.set("arg0", readU16(args[0]));
            pass.set("arg1", (args[1].isNull() ? 0 : readSingle(args[1])));
        }, (retval, ctx, pass) => {
            LOGD("\n[*] SetFloat('" + pass.get("arg0") + "'," + pass.get("arg1") + ")");
            if (needLRInfo)
                LOGZ("\t\t { LR:" + checkCtx(ctx) + " } | { PC:" + checkCtx(ctx, "PC") + " }");
            if (isShowPrintStack)
                LOGZ((GetStackTraceN(ctx)));
        });
        //public static extern int GetInt(string key, int defaultValue)
        A(Il2Cpp.Api.PlayerPrefs._SetInt, (args, ctx, pass) => {
            pass.set("arg0", readU16(args[0]));
            pass.set("arg1", args[1]);
        }, (retval, ctx, pass) => {
            LOGD("\n[*] SetInt('" + pass.get("arg0") + "'," + pass.get("arg1") + ")");
            if (needLRInfo)
                LOGZ("\t\t { LR:" + checkCtx(ctx) + " } | { PC:" + checkCtx(ctx, "PC") + " }");
            if (isShowPrintStack)
                LOGZ((GetStackTraceN(ctx)));
        });
        //public static string GetString(string key)
        A(Il2Cpp.Api.PlayerPrefs._SetString, (args, ctx, pass) => {
            pass.set("arg0", readU16(args[0]));
            pass.set("arg1", readU16(args[1]));
        }, (retval, ctx, pass) => {
            LOGD("\n[*] SetString('" + pass.get("arg0") + "','" + pass.get("arg1") + "')");
            if (needLRInfo)
                LOGZ("\t\t { LR:" + checkCtx(ctx) + " } | { PC:" + checkCtx(ctx, "PC") + " }");
            if (isShowPrintStack)
                LOGZ((GetStackTraceN(ctx)));
        });
    }
};
exports.HookPlayerPrefs = HookPlayerPrefs;
globalThis.HookPlayerPrefs = HookPlayerPrefs;
},{}],89:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./api");
require("./class");
require("./export");
require("./interface");
},{"./api":86,"./class":87,"./export":88,"./interface":90}],90:[function(require,module,exports){
"use strict";
},{}],91:[function(require,module,exports){
"use strict";
},{}],92:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class mscorlibRuntimeTypeHandleAPI {
}
mscorlib.Api.RuntimeTypeHandle = mscorlibRuntimeTypeHandleAPI;
},{}],93:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mscorlib_System_RuntimeTypeHandle_impl = void 0;
const class_1 = require("../class");
require("./interface");
class mscorlib_System_RuntimeTypeHandle_impl extends class_1.mscorlib_System_Object_impl {
}
exports.mscorlib_System_RuntimeTypeHandle_impl = mscorlib_System_RuntimeTypeHandle_impl;
mscorlib.RuntimeTypeHandle = mscorlib_System_RuntimeTypeHandle_impl;
},{"../class":112,"./interface":95}],94:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./api");
require("./class");
require("./interface");
},{"./api":92,"./class":93,"./interface":95}],95:[function(require,module,exports){
"use strict";
},{}],96:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_cache_getter_1 = require("decorator-cache-getter");
class mscorlibRuntimeTypeAPI {
    static get _get_AssemblyQualifiedName() {
        return Il2Cpp.Api.t("mscorlib", "System.RuntimeType", "get_AssemblyQualifiedName", 0, "pointer", ["pointer"]);
    }
    static get _get_BaseType() {
        return Il2Cpp.Api.t("mscorlib", "System.RuntimeType", "get_BaseType", 0, "pointer", ["pointer"]);
    }
    static get _get_DeclaringType() {
        return Il2Cpp.Api.t("mscorlib", "System.RuntimeType", "get_DeclaringType", 0, "pointer", ["pointer"]);
    }
    static get _get_FullName() {
        return Il2Cpp.Api.t("mscorlib", "System.RuntimeType", "get_FullName", 0, "pointer", ["pointer"]);
    }
    static get _get_IsEnum() {
        return Il2Cpp.Api.t("mscorlib", "System.RuntimeType", "get_IsEnum", 0, "bool", ["pointer"]);
    }
    static get _get_IsGenericParameter() {
        return Il2Cpp.Api.t("mscorlib", "System.RuntimeType", "get_IsGenericParameter", 0, "bool", ["pointer"]);
    }
    static get _get_IsGenericType() {
        return Il2Cpp.Api.t("mscorlib", "System.RuntimeType", "get_IsGenericType", 0, "bool", ["pointer"]);
    }
    static get _get_Name() {
        return Il2Cpp.Api.t("mscorlib", "System.RuntimeType", "get_Name", 0, "pointer", ["pointer"]);
    }
    static get _get_Namespace() {
        return Il2Cpp.Api.t("mscorlib", "System.RuntimeType", "get_Namespace", 0, "pointer", ["pointer"]);
    }
    static get _get_ReflectedType() {
        return Il2Cpp.Api.t("mscorlib", "System.RuntimeType", "get_ReflectedType", 0, "pointer", ["pointer"]);
    }
    static get _get_TypeHandle() {
        return Il2Cpp.Api.t("mscorlib", "System.RuntimeType", "get_TypeHandle", 0, "pointer", ["pointer"]);
    }
    static get _get_UnderlyingSystemType() {
        return Il2Cpp.Api.t("mscorlib", "System.RuntimeType", "get_UnderlyingSystemType", 0, "pointer", ["pointer"]);
    }
}
__decorate([
    decorator_cache_getter_1.cache
], mscorlibRuntimeTypeAPI, "_get_AssemblyQualifiedName", null);
__decorate([
    decorator_cache_getter_1.cache
], mscorlibRuntimeTypeAPI, "_get_BaseType", null);
__decorate([
    decorator_cache_getter_1.cache
], mscorlibRuntimeTypeAPI, "_get_DeclaringType", null);
__decorate([
    decorator_cache_getter_1.cache
], mscorlibRuntimeTypeAPI, "_get_FullName", null);
__decorate([
    decorator_cache_getter_1.cache
], mscorlibRuntimeTypeAPI, "_get_IsEnum", null);
__decorate([
    decorator_cache_getter_1.cache
], mscorlibRuntimeTypeAPI, "_get_IsGenericParameter", null);
__decorate([
    decorator_cache_getter_1.cache
], mscorlibRuntimeTypeAPI, "_get_IsGenericType", null);
__decorate([
    decorator_cache_getter_1.cache
], mscorlibRuntimeTypeAPI, "_get_Name", null);
__decorate([
    decorator_cache_getter_1.cache
], mscorlibRuntimeTypeAPI, "_get_Namespace", null);
__decorate([
    decorator_cache_getter_1.cache
], mscorlibRuntimeTypeAPI, "_get_ReflectedType", null);
__decorate([
    decorator_cache_getter_1.cache
], mscorlibRuntimeTypeAPI, "_get_TypeHandle", null);
__decorate([
    decorator_cache_getter_1.cache
], mscorlibRuntimeTypeAPI, "_get_UnderlyingSystemType", null);
mscorlib.Api.RuntimeType = mscorlibRuntimeTypeAPI;
},{"decorator-cache-getter":139}],97:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mscorlib_System_RuntimeType_impl = void 0;
const class_1 = require("../RuntimeTypeHandle/class");
const class_2 = require("../Type/class");
require("./interface");
class mscorlib_System_RuntimeType_impl extends class_2.mscorlib_System_Type_impl {
    get_AssemblyQualifiedName() {
        return readU16(mscorlib.Api.RuntimeType._get_AssemblyQualifiedName(this.handle));
    }
    get_BaseType() {
        return new class_2.mscorlib_System_Type_impl(mscorlib.Api.RuntimeType._get_BaseType(this.handle));
    }
    get_DeclaringType() {
        return new class_2.mscorlib_System_Type_impl(mscorlib.Api.RuntimeType._get_DeclaringType(this.handle));
    }
    get_FullName() {
        return readU16(mscorlib.Api.RuntimeType._get_FullName(this.handle));
    }
    get_IsEnum() {
        return mscorlib.Api.RuntimeType._get_IsEnum(this.handle);
    }
    get_IsGenericParameter() {
        return mscorlib.Api.RuntimeType._get_IsGenericParameter(this.handle);
    }
    get_IsGenericType() {
        return mscorlib.Api.RuntimeType._get_IsGenericType(this.handle);
    }
    get_Name() {
        return readU16(mscorlib.Api.RuntimeType._get_Name(this.handle));
    }
    get_Namespace() {
        return readU16(mscorlib.Api.RuntimeType._get_Namespace(this.handle));
    }
    get_ReflectedType() {
        return new class_2.mscorlib_System_Type_impl(mscorlib.Api.RuntimeType._get_ReflectedType(this.handle));
    }
    get_TypeHandle() {
        return new class_1.mscorlib_System_RuntimeTypeHandle_impl(mscorlib.Api.RuntimeType._get_TypeHandle(this.handle));
    }
    get_UnderlyingSystemType() {
        return new class_2.mscorlib_System_Type_impl(mscorlib.Api.RuntimeType._get_UnderlyingSystemType(this.handle));
    }
}
exports.mscorlib_System_RuntimeType_impl = mscorlib_System_RuntimeType_impl;
mscorlib.RuntimeType = mscorlib_System_RuntimeType_impl;
},{"../RuntimeTypeHandle/class":93,"../Type/class":102,"./interface":99}],98:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./api");
require("./class");
require("./interface");
},{"./api":96,"./class":97,"./interface":99}],99:[function(require,module,exports){
"use strict";
},{}],100:[function(require,module,exports){
"use strict";
},{}],101:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_cache_getter_1 = require("decorator-cache-getter");
class mscorlibTypeAPI {
    static get _Equals_obj() {
        return Il2Cpp.Api.o("mscorlib", "System.Type", "Equals", 1, ["System.Object"], "pointer", ["pointer", "pointer"]);
    }
    static get _Equals_type() {
        return Il2Cpp.Api.o("mscorlib", "System.Type", "Equals", 1, ["System.Type"], "bool", ["pointer", "pointer"]);
    }
    static get _GetArrayRank() {
        return Il2Cpp.Api.t("mscorlib", "System.Type", "GetArrayRank", 0, "int", ["pointer"]);
    }
    static get _GetConstructor() {
        return Il2Cpp.Api.o("mscorlib", "System.Type", "GetConstructor", 1, ["System.Type[]"], "pointer", ["pointer", "pointer"]);
    }
    static get _GetEnumName() {
        return Il2Cpp.Api.t("mscorlib", "System.Type", "GetEnumName", 0, "pointer", ["pointer"]);
    }
    static get _GetEnumNames() {
        return Il2Cpp.Api.t("mscorlib", "System.Type", "GetEnumNames", 0, "pointer", ["pointer"]);
    }
    static get _GetHashCode() {
        return Il2Cpp.Api.t("mscorlib", "System.Type", "GetHashCode", 0, "int", ["pointer"]);
    }
    static get _GetType_0() {
        return Il2Cpp.Api.t("mscorlib", "System.Type", "GetType", 0, "pointer", ["pointer"]);
    }
    static get _GetType_1() {
        return Il2Cpp.Api.t("mscorlib", "System.Type", "GetType", 1, "pointer", ["pointer", "pointer"]);
    }
    static get _ToString() {
        return Il2Cpp.Api.t("mscorlib", "System.Type", "ToString", 0, "pointer", ["pointer"]);
    }
}
__decorate([
    decorator_cache_getter_1.cache
], mscorlibTypeAPI, "_Equals_obj", null);
__decorate([
    decorator_cache_getter_1.cache
], mscorlibTypeAPI, "_Equals_type", null);
__decorate([
    decorator_cache_getter_1.cache
], mscorlibTypeAPI, "_GetArrayRank", null);
__decorate([
    decorator_cache_getter_1.cache
], mscorlibTypeAPI, "_GetConstructor", null);
__decorate([
    decorator_cache_getter_1.cache
], mscorlibTypeAPI, "_GetEnumName", null);
__decorate([
    decorator_cache_getter_1.cache
], mscorlibTypeAPI, "_GetEnumNames", null);
__decorate([
    decorator_cache_getter_1.cache
], mscorlibTypeAPI, "_GetHashCode", null);
__decorate([
    decorator_cache_getter_1.cache
], mscorlibTypeAPI, "_GetType_0", null);
__decorate([
    decorator_cache_getter_1.cache
], mscorlibTypeAPI, "_GetType_1", null);
__decorate([
    decorator_cache_getter_1.cache
], mscorlibTypeAPI, "_ToString", null);
mscorlib.Api.Type = mscorlibTypeAPI;
},{"decorator-cache-getter":139}],102:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mscorlib_System_Type_impl = void 0;
const class_1 = require("../class");
class mscorlib_System_Type_impl extends class_1.mscorlib_System_Object_impl {
    Equals_obj(obj) {
        return mscorlib.Api.Type._Equals_obj(this.handle, obj);
    }
    Equals_type(type) {
        return mscorlib.Api.Type._Equals_type(this.handle, type.handle);
    }
    GetArrayRank() {
        return mscorlib.Api.Type._GetArrayRank(this.handle).toInt32();
    }
    GetConstructor(types) {
        return mscorlib.Api.Type._GetConstructor(this.handle, types[0].handle);
    }
    GetEnumName(obj) {
        return readU16(mscorlib.Api.Type._GetEnumName(this.handle, obj));
    }
    GetEnumNames() {
        return mscorlib.Api.Type._GetEnumNames(this.handle);
    }
    GetHashCode() {
        return mscorlib.Api.Type._GetHashCode(this.handle).toInt32();
    }
    GetType_0() {
        return new mscorlib_System_Type_impl(mscorlib.Api.Type._GetType_0(this.handle));
    }
    GetType_1(typeName) {
        return new mscorlib_System_Type_impl(mscorlib.Api.Type._GetType_1(this.handle, typeName));
    }
    toString() {
        return readU16(mscorlib.Api.Type._ToString(this.handle));
    }
    get name() {
        return this.toString().split('Type: ')[1];
    }
}
exports.mscorlib_System_Type_impl = mscorlib_System_Type_impl;
mscorlib.Type = mscorlib_System_Type_impl;
},{"../class":112}],103:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./api");
require("./class");
require("./interface");
},{"./api":101,"./class":102,"./interface":104}],104:[function(require,module,exports){
"use strict";
},{}],105:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorAPI = void 0;
const class_1 = require("../../class");
require("./export");
require("./class");
require("./interface");
const decorator_cache_getter_1 = require("decorator-cache-getter");
class ColorAPI extends class_1.mscorlib_System_Object_impl {
    static get _ctor_3() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Color", ".ctor", 3, "pointer", ["pointer", "pointer", "pointer", "pointer"]);
    }
    static get _ctor_4() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Color", ".ctor", 4, "pointer", ["pointer", "pointer", "pointer", "pointer", "pointer"]);
    }
    static get _Equals_obj() {
        return Il2Cpp.Api.o("UnityEngine.CoreModule", "UnityEngine.Color", "Equals", 1, ["System.Object"], "bool", ["pointer", "pointer"]);
    }
    static get _Equals_color() {
        return Il2Cpp.Api.o("UnityEngine.CoreModule", "UnityEngine.Color", "Equals", 1, ["UnityEngine.Color"], "bool", ["pointer", "pointer"]);
    }
    static get _GetHashCode() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Color", "GetHashCode", 0, "uint32", ["pointer"]);
    }
    static get _toString() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Color", "ToString", 0, "pointer", ["pointer"]);
    }
    static get _ToString_str_IFormatProvider() {
        return Il2Cpp.Api.t("UnityEngine.CoreModule", "UnityEngine.Color", "ToString", 2, "pointer", ["pointer", "pointer", "pointer"]);
    }
}
__decorate([
    decorator_cache_getter_1.cache
], ColorAPI, "_ctor_3", null);
__decorate([
    decorator_cache_getter_1.cache
], ColorAPI, "_ctor_4", null);
__decorate([
    decorator_cache_getter_1.cache
], ColorAPI, "_Equals_obj", null);
__decorate([
    decorator_cache_getter_1.cache
], ColorAPI, "_Equals_color", null);
__decorate([
    decorator_cache_getter_1.cache
], ColorAPI, "_GetHashCode", null);
__decorate([
    decorator_cache_getter_1.cache
], ColorAPI, "_toString", null);
__decorate([
    decorator_cache_getter_1.cache
], ColorAPI, "_ToString_str_IFormatProvider", null);
exports.ColorAPI = ColorAPI;
Il2Cpp.Api.Color = ColorAPI;
},{"../../class":112,"./class":106,"./export":107,"./interface":108,"decorator-cache-getter":139}],106:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorImpl = void 0;
const class_1 = require("../class");
const api_1 = require("./api");
class ColorImpl extends class_1.mscorlib_System_ValueType {
    r;
    g;
    b;
    a;
    constructor(mPtr) {
        super(mPtr);
        this.r = mPtr.readU8();
        this.g = mPtr.add(8).readU8();
        this.b = mPtr.add(16).readU8();
        this.a = mPtr.add(24).readU8();
    }
    ctor_3(r, g, b) {
        return new ColorImpl(api_1.ColorAPI._ctor_3(this.handle, r, g, b));
    }
    ctor_4(r, g, b, a) {
        return new ColorImpl(api_1.ColorAPI._ctor_4(this.handle, r, g, b, a));
    }
    Equals_obj(obj) {
        return api_1.ColorAPI._Equals_obj(this.handle, obj);
    }
    Equals_color(color) {
        return api_1.ColorAPI._Equals_color(this.handle, color.handle);
    }
    GetHashCode() {
        return api_1.ColorAPI._GetHashCode(this.handle);
    }
    toString() {
        return readU16(api_1.ColorAPI._toString(this.handle));
    }
    toString_str_IFormatProvider(format, provider) {
        return readU16(api_1.ColorAPI._ToString_str_IFormatProvider(this.handle, format, provider));
    }
}
exports.ColorImpl = ColorImpl;
Il2Cpp.Color = ColorImpl;
},{"../class":110,"./api":105}],107:[function(require,module,exports){
"use strict";
},{}],108:[function(require,module,exports){
"use strict";
},{}],109:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector3Impl = void 0;
const class_1 = require("../class");
class Vector3Impl extends class_1.mscorlib_System_ValueType {
    x;
    y;
    z;
    toFixedNum = 2;
    constructor(handle, FixedNum = 2) {
        super(handle);
        this.toFixedNum = FixedNum;
        this.x = handle.readFloat();
        this.y = handle.add(Process.pageSize).readFloat();
        this.z = handle.add(Process.pageSize * 2).readFloat();
    }
    set FixedNum(value) {
        this.toFixedNum = value;
    }
    new(x, y, z) {
        let allocMem = allocVector(0, 0, 0);
        allocMem.writeFloat(x);
        allocMem.add(Process.pageSize).writeFloat(y);
        allocMem.add(Process.pageSize * 2).writeFloat(z);
        return new Vector3Impl(allocMem);
    }
    toString() {
        return `Vector3(${this.handle}) : (${this.x.toFixed(this.toFixedNum)}, ${this.y.toFixed(this.toFixedNum)}, ${this.z.toFixed(this.toFixedNum)})`;
    }
}
exports.Vector3Impl = Vector3Impl;
Il2Cpp.Vector3 = Vector3Impl;
},{"../class":110}],110:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mscorlib_System_ValueType = void 0;
const class_1 = require("../class");
class mscorlib_System_ValueType extends class_1.mscorlib_System_Object_impl {
}
exports.mscorlib_System_ValueType = mscorlib_System_ValueType;
},{"../class":112}],111:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_cache_getter_1 = require("decorator-cache-getter");
class mscorlibObjAPI {
    static get _ctor_0() {
        return Il2Cpp.Api.t("mscorlib", "System.Object", ".ctor", 0, "pointer", ["pointer"]);
    }
    static get _toString() {
        return Il2Cpp.Api.t("mscorlib", "System.Object", "ToString", 0, "pointer", ["pointer"]);
    }
    static get _getType() {
        return Il2Cpp.Api.t("mscorlib", "System.Object", "GetType", 0, "pointer", ["pointer"]);
    }
    static get _finalize() {
        return Il2Cpp.Api.t("mscorlib", "System.Object", "finalize", 0, "pointer", ["pointer"]);
    }
    static get _getHashCode() {
        return Il2Cpp.Api.t("mscorlib", "System.Object", "getHashCode", 0, "pointer", ["pointer"]);
    }
    // 单个参数是实例方法，两个参数是静态方法，这里有bug  参数都是两个
    static get _Equals_1() {
        return Il2Cpp.Api.t("mscorlib", "System.Object", "Equals", 2, "pointer", ["pointer", "pointer"]);
    }
    static get _Equals_2() {
        return Il2Cpp.Api.t("mscorlib", "System.Object", "Equals", 2, "pointer", ["pointer", "pointer", "pointer"]);
    }
}
__decorate([
    decorator_cache_getter_1.cache
], mscorlibObjAPI, "_ctor_0", null);
__decorate([
    decorator_cache_getter_1.cache
], mscorlibObjAPI, "_toString", null);
__decorate([
    decorator_cache_getter_1.cache
], mscorlibObjAPI, "_getType", null);
__decorate([
    decorator_cache_getter_1.cache
], mscorlibObjAPI, "_finalize", null);
__decorate([
    decorator_cache_getter_1.cache
], mscorlibObjAPI, "_getHashCode", null);
__decorate([
    decorator_cache_getter_1.cache
], mscorlibObjAPI, "_Equals_1", null);
__decorate([
    decorator_cache_getter_1.cache
], mscorlibObjAPI, "_Equals_2", null);
Reflect.set(globalThis, "mscorlib", class {
});
Reflect.set(mscorlib, "Api", class {
});
mscorlib.Api.mscorlibObj = mscorlibObjAPI;
},{"decorator-cache-getter":139}],112:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mscorlib_System_Object_impl = void 0;
require("./interface");
// 拓展 mscorlib.System.Object
class mscorlib_System_Object_impl {
    handle;
    constructor(handleOrWrapper) {
        this.handle = handleOrWrapper;
    }
    ctor() {
        return mscorlib.Api.mscorlibObj._ctor_0(allocP(1));
    }
    toString() {
        return readU16(mscorlib.Api.mscorlibObj._toString(this.handle));
    }
    memberwiseClone() {
        throw new Error("Not implemented");
    }
    getType() {
        return new mscorlib.Type(mscorlib.Api.mscorlibObj._getType(this.handle));
    }
    finalize() {
        return mscorlib.Api.mscorlibObj._finalize(this.handle);
    }
    getHashCode() {
        return mscorlib.Api.mscorlibObj._getHashCode(this.handle);
    }
}
exports.mscorlib_System_Object_impl = mscorlib_System_Object_impl;
const getTypeInner = (mPtr) => {
    if (typeof mPtr == "number")
        mPtr = ptr(mPtr);
    return new mscorlib_System_Object_impl(mPtr).getType();
};
const getTypeNameInner = (mPtr) => {
    return getTypeInner(mPtr).name;
};
const getTypeParentShowInfo = (mPtr) => {
    let handle = getTypeInner(mPtr).handle;
    LOGD(`\nType => ${handle}`);
    LOGD(`Name => ${getTypeInner(mPtr).toString()}\n`);
    let describe = `${getTypeInner(mPtr).name}(${getTypeInner(mPtr).handle})`;
    let lastHandle = handle;
    for (let i = 0; i < 10; i++) {
        let baseType = new mscorlib.RuntimeType(handle).get_BaseType();
        if (lastHandle.equals(baseType.handle))
            break;
        lastHandle = baseType.handle;
        if (baseType.handle == ptr(0) || baseType.handle.isNull())
            break;
        describe += ` <--- ${baseType.name}(${baseType.handle}) `;
    }
    LOGD(`${describe}\n`);
};
mscorlib.Object = mscorlib_System_Object_impl;
globalThis.getType = getTypeInner;
globalThis.getTypeName = getTypeNameInner;
globalThis.showType = getTypeParentShowInfo;
},{"./interface":114}],113:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./api");
require("./class");
require("./interface");
require("./GUI/include");
require("./Object/include");
require("./Input/include");
require("./Physics/include");
require("./PlayerPrefs/include");
require("./Resources/include");
require("./Times/include");
require("./Type/include");
require("./RuntimeType/include");
require("./RuntimeTypeHandle/include");
require("./AbstractEventData/include");
require("./Debug/include");
},{"./AbstractEventData/include":26,"./Debug/include":30,"./GUI/include":31,"./Input/include":32,"./Object/include":83,"./Physics/include":85,"./PlayerPrefs/include":89,"./Resources/include":91,"./RuntimeType/include":98,"./RuntimeTypeHandle/include":94,"./Times/include":100,"./Type/include":103,"./api":111,"./class":112,"./interface":114}],114:[function(require,module,exports){
"use strict";
},{}],115:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./thread");
},{"./thread":116}],116:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const attachCurrentThread = () => {
    let thread = Il2Cpp.Api._threadCurrent();
    if (thread.isNull())
        Il2Cpp.Domain.attach();
};
const detachCurrentThread = () => {
    let threadHandle = Il2Cpp.Api._threadCurrent();
    if (!threadHandle.isNull())
        new Il2Cpp.Thread(threadHandle).detach();
};
globalThis.attachCurrentThread = attachCurrentThread;
globalThis.detachCurrentThread = detachCurrentThread;
},{}],117:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./TypeExtends/_include");
},{"./TypeExtends/_include":13}],118:[function(require,module,exports){
"use strict";
},{}],119:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("frida-il2cpp-bridge");
require("./API/list");
require("./API/text");
require("./expand/include");
require("./base/base");
require("./base/breaker");
require("./base/enum");
require("./base/globle");
require("./base/info");
require("./bridge/expand/packer");
require("./bridge/fix/apiFix");
require("./bridge/fix/Il2cppClass");
require("./bridge/fix/il2cppMethod");
require("./java/info");
require("./native/std/std_deque");
require("./native/std/std_string");
require("./native/std/std_vector");
require("./utils/_include");
require("./native/include");
require("./globel");
},{"./API/list":1,"./API/text":2,"./base/base":3,"./base/breaker":4,"./base/enum":5,"./base/globle":6,"./base/info":7,"./bridge/expand/packer":9,"./bridge/fix/Il2cppClass":10,"./bridge/fix/apiFix":11,"./bridge/fix/il2cppMethod":12,"./expand/include":117,"./globel":118,"./java/info":121,"./native/include":122,"./native/std/std_deque":124,"./native/std/std_string":125,"./native/std/std_vector":126,"./utils/_include":127,"frida-il2cpp-bridge":167}],120:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
require("./include");
// setImmediate(() => Il2Cpp.perform(() => main()))
function main() {
}
exports.main = main;
globalThis.main = main;
},{"./include":119}],121:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchApp = exports.getApkInfo = void 0;
const enum_1 = require("../base/enum");
/**
 * 获取APK的一些基本信息
 */
function getApkInfo() {
    Java.perform(() => {
        LOG(getLine(100), enum_1.LogColor.C33);
        var context = Java.use('android.app.ActivityThread').currentApplication().getApplicationContext();
        var pkgInfo = context.getPackageManager().getPackageInfo(context.getPackageName(), 0);
        // var appInfo = context.getApplicationInfo()
        let appInfo = pkgInfo.applicationInfo.value;
        let labelRes = appInfo.labelRes.value;
        let strName = context.getResources().getString(labelRes);
        LOG("[*]AppName\t\t" + strName + " (UID:" + appInfo.uid.value + ")\t ID:0x" + (appInfo.labelRes.value).toString(16), enum_1.LogColor.C36);
        let flags = appInfo.flags.value;
        LOG("\t\t\tBackupable -> " + ((flags & 32768) != 0) + "\t" + "Debugable -> " + ((flags & 2) != 0), enum_1.LogColor.C36);
        let str_pkgName = context.getPackageName();
        LOG("\n[*]PkgName\t\t" + str_pkgName, enum_1.LogColor.C36);
        var verName = pkgInfo.versionName.value;
        var verCode = pkgInfo.versionCode.value;
        var targetSdkVersion = pkgInfo.applicationInfo.value.targetSdkVersion.value;
        LOG("\n[*]Verison\t\t{ " + verName + " / " + verCode + " }\t(targetSdkVersion:" + targetSdkVersion + ")", enum_1.LogColor.C36);
        let appSize = Java.use("java.io.File").$new(appInfo.sourceDir.value).length();
        LOG("\n[*]AppSize\t\t" + appSize + "\t(" + (appSize / 1024 / 1024).toFixed(2) + " MB)", enum_1.LogColor.C36);
        LOG("\n[*]Time\t\t\tInstallTime\t" + new Date(pkgInfo.firstInstallTime.value).toLocaleString(), enum_1.LogColor.C36);
        LOG("\t\t\tUpdateTime\t" + new Date(pkgInfo.lastUpdateTime.value).toLocaleString(), enum_1.LogColor.C36);
        let ApkLocation = appInfo.sourceDir.value;
        let TempFile = appInfo.dataDir.value;
        LOG("\n[*]Location\t\t" + ApkLocation + "\n\t\t\t" + getLibPath() + "\n\t\t\t" + TempFile, enum_1.LogColor.C36);
        // PackageManager.GET_SIGNATURES == 0x00000040
        let pis = context.getPackageManager().getPackageInfo(str_pkgName, 0x00000040);
        let hexDigist = (pis.signatures.value)[0].toByteArray();
        LOG("\n[*]Signatures\t\tMD5\t " + hexdigest(hexDigist, 'MD5') +
            "\n\t\t\tSHA-1\t " + hexdigest(hexDigist, 'SHA-1') +
            "\n\t\t\tSHA-256\t " + hexdigest(hexDigist, 'SHA-256'), enum_1.LogColor.C36);
        LOG("\n[*]unity.build-id\t" + getMetaData('unity.build-id'), enum_1.LogColor.C36);
        LOG(getLine(100), enum_1.LogColor.C33);
    });
    function getMetaData(key) {
        // public static final int GET_META_DATA = 0x00000080
        let context = Java.use('android.app.ActivityThread').currentApplication().getApplicationContext();
        let appInfo = context.getPackageManager().getApplicationInfo(context.getPackageName(), 0x00000080);
        let metaData = appInfo.metaData.value;
        if (null != metaData) {
            // var metaDataB = Java.cast(metaData,Java.use("android.os.BaseBundle"))
            // LOG(metaDataB.mMap.value)
            return metaData.getString(key);
        }
        return "...";
    }
    /**
     * 计算byte字节并转换为String返回
     * @param {*} paramArrayOfByte byte 字节
     * @param {*} algorithm 算法 MD5 / SHA-1 / SHA-256
     */
    function hexdigest(paramArrayOfByte, algorithm) {
        const hexDigits = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 97, 98, 99, 100, 101, 102];
        let localMessageDigest = Java.use("java.security.MessageDigest").getInstance(algorithm);
        localMessageDigest.update(paramArrayOfByte);
        let arrayOfByte = localMessageDigest.digest();
        let arrayOfChar = [];
        for (let i = 0, j = 0;; i++, j++) {
            let strLenth = algorithm == "MD5" ? 16 : (algorithm == "SHA-1" ? 20 : 32);
            if (i >= strLenth)
                return Java.use("java.lang.String").$new(arrayOfChar);
            let k = arrayOfByte[i];
            arrayOfChar[j] = hexDigits[(0xF & k >>> 4)];
            arrayOfChar[++j] = hexDigits[(k & 0xF)];
        }
    }
    function getLibPath(name = undefined) {
        let retStr = "";
        Java.perform(() => {
            let context = Java.use('android.app.ActivityThread').currentApplication().getApplicationContext();
            let libPath = context.getApplicationInfo().nativeLibraryDir.value;
            retStr = libPath + "/" + (name == undefined ? "" : name);
        });
        return retStr;
    }
}
exports.getApkInfo = getApkInfo;
/**
 * 用包名启动 APK
 * @param {String} pkgName
 */
var launchApp = (pkgName) => Java.perform(() => {
    let context = Java.use('android.app.ActivityThread').currentApplication().getApplicationContext();
    context.startActivity(Java.use("android.content.Intent").$new(context.getPackageManager().getLaunchIntentForPackage(pkgName)));
});
exports.launchApp = launchApp;
Reflect.set(globalThis, "launchApp", launchApp);
Reflect.set(globalThis, "getApkInfo", getApkInfo);
},{"../base/enum":5}],122:[function(require,module,exports){
"use strict";
// import "./qbdi/frida-qbdi"
// import "./qbdi/main-qdbi"
Object.defineProperty(exports, "__esModule", { value: true });
require("./std/_include");
},{"./std/_include":123}],123:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./std_deque");
require("./std_string");
require("./std_vector");
},{"./std_deque":124,"./std_string":125,"./std_vector":126}],124:[function(require,module,exports){
"use strict";
// std::deque of MSVC 120 (2013)
Object.defineProperty(exports, "__esModule", { value: true });
/*
_Container_proxy *_Myproxy; // from _Container_base12

_Mapptr _Map;		// pointer to array of pointers to blocks
size_type _Mapsize;	// size of map array, zero or 2^N
size_type _Myoff;	// offset of initial element
size_type _Mysize;	// current length of sequence


#define _DEQUESIZ	(sizeof (value_type) <= 1 ? 16 \
                    : sizeof (value_type) <= 2 ? 8 \
                    : sizeof (value_type) <= 4 ? 4 \
                    : sizeof (value_type) <= 8 ? 2 \
                    : 1)	// elements per block (a power of 2)
*/
class StdDeque {
    constructor(addr, valueSize, introspectElement) {
        this.addr = addr;
        this.valueSize = valueSize;
        this.introspectElement = introspectElement;
    }
    get DEQUESIZ() {
        return this.valueSize <= 1 ? 16 :
            this.valueSize <= 2 ? 8 :
                this.valueSize <= 4 ? 4 :
                    this.valueSize <= 8 ? 2 :
                        1;
    }
    get containerProxy() {
        return this.addr.readPointer();
    }
    get map() {
        return this.addr.add(Process.pointerSize).readPointer();
    }
    get mapsize() {
        return this.addr.add(Process.pointerSize * 2).readPointer();
    }
    get myoff() {
        return this.addr.add(Process.pointerSize * 3).readPointer();
    }
    get mysize() {
        return this.addr.add(Process.pointerSize * 4).readPointer();
    }
    get contents() {
        const r = [];
        const DEQUESIZ = this.DEQUESIZ;
        const map = this.map;
        const mapsize = this.mapsize;
        const myoff = this.myoff.toInt32();
        const mysize = this.mysize.toInt32();
        for (let i = myoff; i < myoff + mysize; i++) {
            const wrappedIndex = i % mapsize;
            const blockIndex = Math.floor(wrappedIndex / DEQUESIZ);
            const off = wrappedIndex % DEQUESIZ;
            const blockAddr = map.add(Process.pointerSize * blockIndex).readPointer();
            const elemAddr = blockAddr.add(this.valueSize * off);
            let elem;
            if (this.introspectElement) {
                elem = this.introspectElement(elemAddr);
            }
            else {
                elem = elemAddr.readByteArray(this.valueSize);
            }
            r.push(elem);
        }
        return r;
    }
    toString() {
        return "deque@" + this.addr +
            "{ map=" + this.map +
            ", offset=" + this.myoff +
            ", size=" + this.mysize +
            ", contents: " + this.contents + "}";
    }
}
exports.default = StdDeque;
},{}],125:[function(require,module,exports){
"use strict";
// std::string of MSVC 120 (2013)
Object.defineProperty(exports, "__esModule", { value: true });
/*
union
{
    value_type _Buf[_BUF_SIZE];
    pointer _Ptr;
};
size_type _Mysize;	// current length of string
size_type _Myres;	// current storage reserved for string
*/
const BUF_SIZE = 16;
class StdString {
    constructor(addr) {
        this.addr = addr;
    }
    get bufAddr() {
        if (this.reservedSize.compare(16) > 0) {
            return this.addr.readPointer();
        }
        else {
            return this.addr;
        }
    }
    get size() {
        return this.addr.add(BUF_SIZE).readPointer();
    }
    get reservedSize() {
        return this.addr.add(BUF_SIZE).add(Process.pointerSize).readPointer();
    }
    toString() {
        const size = this.size;
        if (size.isNull()) {
            return "<EMPTY std::string>";
        }
        return Memory.readCString(this.bufAddr, size.toInt32());
    }
}
exports.default = StdString;
},{}],126:[function(require,module,exports){
"use strict";
// std::vector of MSVC 120 (2013)
Object.defineProperty(exports, "__esModule", { value: true });
/*
pointer _Myfirst;	// pointer to beginning of array
pointer _Mylast;	// pointer to current end of sequence
pointer _Myend;		// pointer to end of array
*/
class StdVector {
    constructor(addr, options) {
        this.addr = addr;
        this.elementSize = options.elementSize ? options.elementSize : Process.pointerSize;
        this.introspectElement = options.introspectElement;
    }
    get myfirst() {
        return this.addr.readPointer();
    }
    get mylast() {
        return this.addr.add(Process.pointerSize).readPointer();
    }
    get myend() {
        return this.addr.add(2 * Process.pointerSize).readPointer();
    }
    countBetween(begin, end) {
        if (begin.isNull()) {
            return 0;
        }
        const delta = end.sub(begin);
        return delta.toInt32() / this.elementSize;
    }
    get size() {
        return this.countBetween(this.myfirst, this.mylast);
    }
    get capacity() {
        return this.countBetween(this.myfirst, this.myend);
    }
    toString() {
        let r = "std::vector(" + this.myfirst + ", " + this.mylast + ", " + this.myend + ")";
        r += "{ size: " + this.size + ", capacity: " + this.capacity;
        if (this.introspectElement) {
            r += ", content: [";
            const first = this.myfirst;
            if (!first.isNull()) {
                const last = this.mylast;
                for (let p = first; p.compare(last) < 0; p = p.add(this.elementSize)) {
                    if (p.compare(first) > 0) {
                        r += ", ";
                    }
                    r += this.introspectElement(p);
                }
            }
            r += "]";
        }
        r += " }";
        return r;
    }
}
exports.default = StdVector;
},{}],127:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./alloc");
require("./cache");
require("./caller");
require("./checkP");
require("./common");
require("./formart");
require("./logger");
require("./math");
require("./reader");
require("./stack");
require("./context");
// 不需要就注释减小体积
// import "./http"
},{"./alloc":128,"./cache":129,"./caller":130,"./checkP":131,"./common":132,"./context":133,"./formart":134,"./logger":135,"./math":136,"./reader":137,"./stack":138}],128:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allocVector = exports.allocUStr = exports.allocCStr = exports.allocS = exports.alloc = void 0;
const enum_1 = require("../base/enum");
let allocStrInner = (str, type = enum_1.TYPE_STR.C_STR) => type == enum_1.TYPE_STR.C_STR ?
    Memory.allocUtf8String(str) : Il2Cpp.Api._stringNew(Memory.allocUtf8String(str));
const allocCStr = (str) => allocStrInner(str, enum_1.TYPE_STR.C_STR);
exports.allocCStr = allocCStr;
const allocUStr = (str) => allocStrInner(str, enum_1.TYPE_STR.U_STR);
exports.allocUStr = allocUStr;
const allocS = (size = Process.pointerSize) => Memory.alloc(size);
exports.allocS = allocS;
const alloc = (size = 1) => allocS(size * p_size);
exports.alloc = alloc;
/**
 * 创建一个vector2/vector3/vector4
 * 也可使用u3d自己的函数创建
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @param {Number} w
 */
function allocVector(x = 0, y = 0, z = 0, w) {
    let argsLength = arguments.length;
    argsLength = argsLength == 0 ? 3 : argsLength;
    let temp_vector = alloc(argsLength + 1);
    for (let index = 0; index < argsLength; ++index)
        temp_vector.add(Process.pointerSize * index).writeFloat(arguments[index] == undefined ? 0 : arguments[index]);
    temp_vector.add(Process.pointerSize * argsLength).writeInt(0);
    return temp_vector;
}
exports.allocVector = allocVector;
globalThis.allocCStr = allocCStr;
globalThis.allocUStr = allocUStr;
globalThis.allocVector = allocVector;
globalThis.alloc = alloc;
globalThis.allocP = allocS;
},{"../base/enum":5}],129:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runOnce = exports.cacheInstances = void 0;
function cacheInstances(Class) {
    const instanceCache = new Map();
    return new Proxy(Class, {
        construct(Target, argArray) {
            const handle = argArray[0].toUInt32();
            if (!instanceCache.has(handle)) {
                instanceCache.set(handle, new Target(argArray[0]));
            }
            return instanceCache.get(handle);
        }
    });
}
exports.cacheInstances = cacheInstances;
const runOnceCache = new Map();
function runOnce(name) {
    return function decorator(t, n, descriptor) {
        const original = descriptor.value;
        if (!runOnceCache.has(original)) {
            if (typeof original === 'function') {
                descriptor.value = function (...args) {
                    console.log("Logged at:", new Date().toLocaleString());
                    const result = original.apply(this, args);
                    console.log(`Result from ${name}: ${result}`);
                    runOnceCache.set(original, result);
                    return result;
                };
            }
        }
        return runOnceCache.get(original);
    };
}
exports.runOnce = runOnce;
},{}],130:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callFunctionRA = exports.callFunctionRCS = exports.callFunctionRUS = exports.callFunctionRF = exports.callFunctionRS = exports.callFunctionRI = exports.callFunctionRB = exports.callFunction = void 0;
const checkP_1 = require("./checkP");
const reader_1 = require("./reader");
// callFunction("strcmp",allocStr("123"),allocStr("123"))
// callFunction(["strcmp"],allocStr("123"),allocStr("123"))
// callFunction(["libc.so","strcmp"],allocStr("123"),allocStr("123"))
function callFunction(value, ...args) {
    try {
        if (value == undefined)
            return ptr(0x0);
        for (let i = 1; i <= (arguments.length < 5 ? 5 : arguments.length) - 1; i++)
            arguments[i] = arguments[i] == undefined ? ptr(0x0) : ptr(String(arguments[i]));
        return new NativeFunction((0, checkP_1.checkPointer)(value, true), 'pointer', ['pointer', 'pointer', 'pointer', 'pointer'])(arguments[1], arguments[2], arguments[3], arguments[4]);
    }
    catch (e) {
        LOG(e, LogColor.C95);
        return ptr(0);
    }
}
exports.callFunction = callFunction;
// 返回 boolean
const callFunctionRB = (mPtr, ...args) => callFunctionRI(mPtr, ...args) == 1;
exports.callFunctionRB = callFunctionRB;
// 返回值 toInt32
const callFunctionRI = (mPtr, ...args) => callFunction(mPtr, ...args).toInt32();
exports.callFunctionRI = callFunctionRI;
// readSingle
const callFunctionRS = (mPtr, ...args) => (0, reader_1.readSingle)(callFunction(mPtr, ...args));
exports.callFunctionRS = callFunctionRS;
// readFloat
const callFunctionRF = (mPtr, ...args) => alloc(p_size * 2).writePointer(callFunction(mPtr, ...args)).readFloat();
exports.callFunctionRF = callFunctionRF;
// 返回值为 Unity String
const callFunctionRUS = (mPtr, ...args) => (0, reader_1.readU16)(callFunction(mPtr, ...args));
exports.callFunctionRUS = callFunctionRUS;
// 返回值为 C String
const callFunctionRCS = (mPtr, ...args) => {
    let tmpRet = callFunction(mPtr, ...args).readCString();
    return tmpRet == null ? "" : tmpRet;
};
exports.callFunctionRCS = callFunctionRCS;
// 返回值为 [] / display / hashset size off:0x10
const callFunctionRA = (mPtr, ...args) => (0, reader_1.showArray)(callFunction(mPtr, ...args));
exports.callFunctionRA = callFunctionRA;
globalThis.callFunction = callFunction;
globalThis.callFunctionRB = callFunctionRB;
globalThis.callFunctionRI = callFunctionRI;
globalThis.callFunctionRS = callFunctionRS;
globalThis.callFunctionRF = callFunctionRF;
globalThis.callFunctionRUS = callFunctionRUS;
globalThis.callFunctionRCS = callFunctionRCS;
globalThis.callFunctionRA = callFunctionRA;
},{"./checkP":131,"./reader":137}],131:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPointer = void 0;
/**
 * 判断mPtr是不是ilbil2cpp.so中的地址,自动加上基址
 * 只会自动添加上属于libil2cpp的基地址
 * @param {Pointer} value
 * @returns ptr
 */
const checkPointer = (value, throwErr = false, showLog = false) => {
    if (typeof value === "number") {
        return calPointer(ptr(value));
    }
    else if (typeof value === "string") {
        return Module.findExportByName(null, value);
    }
    else if (typeof value === "function") {
        return value;
    }
    else if (typeof value === "object") {
        if (value instanceof NativePointer) {
            return calPointer(value);
        }
        else if (value instanceof (Array)) {
            if (!checkValue(value)) {
                if (throwErr)
                    throw new Error("checkPointer: checkValue Error");
                else
                    return ptr(0);
            }
            switch (value.length) {
                case 1:
                    return Module.findExportByName(null, value[0]);
                case 2:
                    return Module.findExportByName(value[0], value[1]);
                case 3:
                    return find_method(value[0], value[1], value[2], value[3]);
                default:
                    if (throwErr)
                        throw new Error("checkPointer:UnKnow value length \nArray<> length must be 1,2,3");
                    else
                        return ptr(0);
            }
        }
        else {
            if (throwErr)
                throw new Error("checkPointer: Error type");
            else
                return ptr(0);
        }
    }
    return ptr(0);
    function calPointer(mPtr) {
        if (mPtr.isNull() || !mPtr.compare(soAddr))
            return mPtr;
        LOGE(mPtr);
        try {
            let tmpValue = Process.findModuleByAddress(mPtr);
            if (tmpValue === null) {
                let addValue = Il2Cpp.module.base.add(mPtr);
                let tmpModule = Process.findModuleByAddress(addValue);
                if (tmpModule === null) {
                    if (throwErr)
                        throw new Error("checkPointer: can't find module");
                    else
                        return ptr(0);
                }
                else
                    return addValue;
            }
            else
                return mPtr;
        }
        catch (error) {
            if (throwErr)
                throw error;
            return ptr(0);
        }
    }
    function checkValue(value) {
        if (value.length == 3) {
            if (typeof value[0] !== "string")
                return false;
            if (typeof value[1] !== "string")
                return false;
            if (typeof value[2] !== "number")
                return false;
        }
        for (let i = 0; i < value.length; i++) {
            if (value.length != 3) {
                if (typeof value[i] !== "string")
                    return false;
            }
        }
        return true;
    }
};
exports.checkPointer = checkPointer;
globalThis.checkPointer = checkPointer;
},{}],132:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJclassName = exports.mapValueToArray = exports.PTR2NativePtr = exports.filterDuplicateOBJ = exports.checkCtx = exports.cancelAllNopedFunction = exports.cancelNop = exports.nopFunction = exports.replaceFunction = exports.detachAll = exports.attachNative = exports.SeeTypeToString = exports.getFunctionAddrFromCls = void 0;
const enum_1 = require("../base/enum");
const globle_1 = require("../base/globle");
function PTR2NativePtr(mPtr) {
    if (mPtr == undefined)
        return ptr(0);
    if (typeof mPtr == "number")
        mPtr = ptr(mPtr);
    return mPtr;
}
exports.PTR2NativePtr = PTR2NativePtr;
var passValueKey;
(function (passValueKey) {
    passValueKey["org"] = "org";
    passValueKey["src"] = "src";
    passValueKey["enter"] = "enter";
    passValueKey["leave"] = "leave";
    passValueKey["time"] = "time";
})(passValueKey || (passValueKey = {}));
let map_attach_listener = (0, globle_1.GET_MAP)(enum_1.MapKAY.map_attach_listener);
const attachNative = (mPtr, mOnEnter, mOnLeave, needRecord = true) => {
    if (typeof mPtr == "number")
        mPtr = ptr(mPtr);
    if (mPtr instanceof NativePointer && mPtr.isNull())
        return;
    var passValue = new Map();
    passValue.set(passValueKey.org, mPtr);
    passValue.set(passValueKey.src, mPtr);
    passValue.set(passValueKey.enter, mOnEnter);
    passValue.set(passValueKey.leave, mOnLeave);
    passValue.set(passValueKey.time, new Date());
    mPtr = checkPointer(mPtr);
    let Listener = Interceptor.attach(mPtr, {
        onEnter: function (args) {
            if (mOnEnter != undefined)
                mOnEnter(args, this.context, passValue);
        },
        onLeave: function (retval) {
            if (mOnLeave != undefined)
                mOnLeave(retval, this.context, passValue);
        }
    });
    // 记录已经被Attach的函数地址以及listner,默认添加listener记录 (只有填写false的时候不记录)
    if (needRecord)
        map_attach_listener.set(String(mPtr), Listener);
};
exports.attachNative = attachNative;
// 用来记录已经被 replace 的函数地址
let arr_nop_addr = new Array();
// nop 指定函数
var nopFunction = (mPtr) => {
    if (typeof mPtr == "number")
        mPtr = ptr(mPtr);
    if (mPtr == undefined)
        return;
    replaceFunction(mPtr, () => ptr(0), true);
};
exports.nopFunction = nopFunction;
// 取消被 nop 的函数
var cancelNop = (mPtr) => {
    if (typeof mPtr == "number")
        mPtr = ptr(mPtr);
    if (mPtr == ptr(0))
        return;
    mPtr = checkPointer(mPtr);
    Interceptor.revert(mPtr);
    for (let i = 0; i < arr_nop_addr.length; i++) {
        if (String(arr_nop_addr[i]) == String(mPtr)) {
            arr_nop_addr = arr_nop_addr.splice(arr_nop_addr[i], 1);
        }
    }
};
exports.cancelNop = cancelNop;
// 取消所有已经Replace的函数
var cancelAllNopedFunction = () => arr_nop_addr.forEach((addr) => Interceptor.revert(addr));
exports.cancelAllNopedFunction = cancelAllNopedFunction;
//detach ---> A(mPtr)
const detachAll = (mPtr) => {
    let map_attach_listener = (0, globle_1.GET_MAP)(enum_1.MapKAY.map_attach_listener);
    if (typeof mPtr == "number")
        mPtr = ptr(mPtr);
    if (mPtr == undefined) {
        map_attach_listener.clear();
        Interceptor.detachAll();
    }
    else {
        let key = String(checkPointer(mPtr));
        let listener = map_attach_listener.get(key);
        if (listener != undefined) {
            listener.detach();
            map_attach_listener.delete(key);
        }
    }
};
exports.detachAll = detachAll;
function replaceFunction(mPtr, callBack, TYPENOP = true) {
    if (typeof mPtr == "number")
        mPtr = ptr(mPtr);
    let src_ptr = mPtr;
    mPtr = checkPointer(mPtr);
    // 记录已经被 Replace 的函数地址
    if (String(arr_nop_addr).indexOf(String(mPtr)) == -1) {
        arr_nop_addr.push(String(mPtr));
    }
    else {
        //先取消掉再重新 replace
        Interceptor.revert(mPtr);
    }
    // 原函数的引用也可以再replace中调用findTransform
    let srcFunc = new NativeFunction(mPtr, 'pointer', ['pointer', 'pointer', 'pointer', 'pointer']);
    Interceptor.replace(mPtr, new NativeCallback((arg0, arg1, arg2, arg3) => {
        LOGW("\nCalled " + (TYPENOP ? "Replaced" : "Nop") + " function ---> " + mPtr + " (" + src_ptr.sub(Il2Cpp.module.base) + ")");
        let ret = callBack(srcFunc, arg0, arg1, arg2, arg3);
        return ret == null ? ptr(0) : ret;
    }, 'pointer', ['pointer', 'pointer', 'pointer', 'pointer']));
}
exports.replaceFunction = replaceFunction;
const getFunctionAddrFromCls = (clsptr, funcName) => {
    if (typeof clsptr == "string")
        clsptr = findClass(clsptr);
    if (typeof clsptr == "number")
        clsptr = ptr(clsptr);
    let retArray = new Il2Cpp.Class(clsptr).methods;
    for (let i = 0; i < retArray.length; i++)
        if (retArray[i].name.indexOf(funcName) != -1)
            return retArray[i].relativeVirtualAddress;
    return -1;
};
exports.getFunctionAddrFromCls = getFunctionAddrFromCls;
// 查看类型的,主要用来区分transform和gameObj
const SeeTypeToString = (obj, b) => {
    if (typeof obj == "number")
        obj = ptr(obj);
    if (obj == undefined || obj == ptr(0))
        return;
    let s_type = callFunction(find_method("UnityEngine.CoreModule", "Object", "ToString", 0), obj);
    if (b == undefined) {
        LOG(readU16(s_type));
    }
    else {
        return readU16(s_type);
    }
};
exports.SeeTypeToString = SeeTypeToString;
/**
 * 未找到 void *Art::Current() 就将就这么用一下
 * 运行这个 getJclassName 函数时候再两秒钟内触发一下 DecodeJObject 函数即可得到 jclsName
 *
 * 参考链接：
 * https://www.jianshu.com/p/dba5e5ef2ad5?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation
 * https://cs.android.com/android/platform/superproject/+/master:art/runtime/mirror/class.cc;l=1634;bpv=1;bpt=1?q=class.cc&sq=&ss=android%2Fplatform%2Fsuperproject
 * @param {*} jclsName
 */
const getJclassName = (jclsName, ShouldRet) => {
    ShouldRet == undefined ? false : true;
    let pVoid = callFunction((0, globle_1.GET_F)(enum_1.EpFunc.DecodeJObject), (0, globle_1.GET_F)(enum_1.EpFunc.ArtCurrent), jclsName);
    let k_class = callFunction((0, globle_1.GET_F)(enum_1.EpFunc.GetDescriptor), pVoid, alloc());
    if (ShouldRet)
        return String(k_class.readCString());
    LOG("\n" + String(k_class.readCString()) + "\n", enum_1.LogColor.C36);
};
exports.getJclassName = getJclassName;
function checkCtx(ctx, type = "LR") {
    let TMP = getPlatformCtx(ctx);
    let lr = TMP.lr;
    let pc = TMP.pc;
    let md_lr = Process.findModuleByAddress(lr);
    if (type == "LR" && md_lr != null)
        return lr.sub(md_lr.base) + `|${md_lr.name}`;
    let md_pc = Process.findModuleByAddress(pc);
    if (type == "PC" && md_pc != null)
        return pc.sub(md_pc.base) + `|${md_pc.name}`;
    if (type == "SP")
        return String(TMP.sp).toString();
    return JSON.stringify(ctx);
}
exports.checkCtx = checkCtx;
const mapValueToArray = (map) => {
    var list = [];
    for (var key in map)
        list.push([key, map.get(key)]);
    return list;
};
exports.mapValueToArray = mapValueToArray;
var runOnMain = (UpDatePtr, Callback) => {
    if (Callback == undefined)
        return;
    if (typeof (UpDatePtr) == "function") {
        Callback = UpDatePtr;
        UpDatePtr = find_method("UnityEngine.UI", "CanvasUpdateRegistry", "PerformUpdate", 0);
    }
    A(UpDatePtr, () => {
        if (Callback != undefined && Callback != null) {
            try {
                Callback();
            }
            catch (e) {
                LOGE(e);
            }
            Callback = () => { };
        }
    });
};
var SendMessage = (str0, str1, str2 = "") => {
    // Java 
    Java.perform(() => Java.use("com.unity3d.player.UnityPlayer").UnitySendMessage(str0, str1, str2));
    // Native 
    // callFunction(Module.findExportByName("libunity.so","UnitySendMessage"),allocStr(str0,1),allocStr(str1,1),allocStr(str2,1))
};
var SendMessageImpl = (platform) => {
    switch (platform) {
        case "IronSource":
            IronSourceEvents();
            break;
        case "MaxSdkCallbacks":
            MaxSdkCallbacks();
            break;
        case "MoPubManager":
            MoPubManager();
            break;
        case "TPluginsGameObject":
            TTPluginsGameObject();
            break;
        default:
            IronSourceEvents();
            MaxSdkCallbacks();
            MoPubManager();
            TTPluginsGameObject();
            break;
    }
    SendMessage('GameAnalytics', 'OnCommandCenterUpdated', '');
    SendMessage('GameAnalytics', 'OnRemoteConfigsUpdated', '');
    SendMessage('UnityFacebookSDKPlugin', 'OnInitComplete', '{"key_hash":"0eWmEB4CY7TpepNbZdxCOaz2Crs=\n"}');
    function IronSourceEvents() {
        SendMessage("IronSourceEvents", "onRewardedVideoAvailabilityChanged", "true");
        SendMessage("IronSourceEvents", "onRewardedVideoAdShowFailedDemandOnly", "true");
        SendMessage('IronSourceEvents', 'onInterstitialAdReady', '');
        SendMessage("IronSourceEvents", "onRewardedVideoAdOpened", "");
        SendMessage("IronSourceEvents", "onRewardedVideoAdStarted", "");
        SendMessage("IronSourceEvents", "onRewardedVideoAdEnded", "");
        SendMessage("IronSourceEvents", "onRewardedVideoAdRewarded", "{'placement_reward_name':'Virtual Item','placement_name':'rewardedVideo','placement_reward_amount':'1','placement_id':'2'}");
        SendMessage("IronSourceEvents", "onRewardedVideoAdClosed", "");
        SendMessage("IronSourceRewardedVideoAndroid", "onRewardedVideoAvailabilityChanged", "true");
        SendMessage("IronSourceRewardedVideoAndroid", "onRewardedVideoAdShowFailedDemandOnly", "true");
        SendMessage('IronSourceRewardedVideoAndroid', 'onInterstitialAdReady', '');
        SendMessage("IronSourceRewardedVideoAndroid", "onRewardedVideoAdOpened", "");
        SendMessage("IronSourceRewardedVideoAndroid", "onRewardedVideoAdStarted", "");
        SendMessage("IronSourceRewardedVideoAndroid", "onRewardedVideoAdEnded", "");
        SendMessage("IronSourceRewardedVideoAndroid", "OnRewardedVideoAdRewarded", "{'placement_reward_name':'Virtual Item','placement_name':'rewardedVideo','placement_reward_amount':'1','placement_id':'2'}");
        SendMessage("IronSourceRewardedVideoAndroid", "onRewardedVideoAdClosed", "");
    }
    function MaxSdkCallbacks() {
        SendMessage('MaxSdkCallbacks', 'ForwardEvent', 'networkName=AppLovin\nname=OnRewardedAdRevenuePaidEvent\nrevenue=0.014579974174499511\nplacement=\nadUnitId=e01cb721520cd33c\ncreativeId=11831000\n');
        SendMessage('MaxSdkCallbacks', 'ForwardEvent', 'networkName=AppLovin\nname=OnRewardedAdDisplayedEvent\nrevenue=0.014579974174499511\nplacement=\nadUnitId=e01cb721520cd33c\ncreativeId=11831000\n');
        SendMessage('MaxSdkCallbacks', 'ForwardEvent', 'revenue=0.014579974174499511\nnetworkName=AppLovin\nname=OnRewardedAdReceivedRewardEvent\nplacement=\nrewardAmount=0\nadUnitId=e01cb721520cd33c\ncreativeId=11831000\nrewardLabel=\n');
        SendMessage('MaxSdkCallbacks', 'ForwardEvent', 'networkName=AppLovin\nname=OnRewardedAdHiddenEvent\nrevenue=0.014579974174499511\nplacement=\nadUnitId=e01cb721520cd33c\ncreativeId=11831000\n');
        SendMessage('MaxSdkCallbacks', 'OnRollicAdsRewardedVideoClickedEvent', 'name=OnSdkInitializedEvent\nconsentDialogState=2\ncountryCode=SG\n');
        SendMessage("MaxSdkCallbacks", "OnRollicAdsRewardedVideoClosedEvent", "name=OnRewardedAdDisplayedEvent\nadUnitId=ec1a772e0459f45b");
        SendMessage("MaxSdkCallbacks", "OnRollicAdsRewardedVideoReceivedRewardEvent", "name=OnRewardedAdReceivedRewardEvent\nrewardAmount=0\nadUnitId=ec1a772e0459f45b\nrewardLabel=");
        SendMessage("MaxSdkCallbacks", "OnRollicAdsRewardedVideoShownEvent", "name=OnRewardedAdHiddenEvent\nadUnitId=ec1a772e0459f45b");
        SendMessage("MaxSdkCallbacks", "OnRollicAdsRewardedVideoLoadedEvent", "name=OnRewardedAdLoadedEvent\nadUnitId=ec1a772e0459f45b");
    }
    function MoPubManager() {
        // java.lang.Throwable
        // at com.unity3d.player.UnityPlayer.UnitySendMessage(Native Method)
        // at com.mopub.unity.MoPubUnityPlugin$UnityEvent.Emit(MoPubUnityPlugin.java:95)
        // at com.mopub.unity.MoPubRewardedVideoUnityPluginManager.onRewardedVideoClosed(MoPubRewardedVideoUnityPluginManager.java:67)
        // at com.mopub.mobileads.MoPubRewardedVideos$1.callback(MoPubRewardedVideos.java:87)
        // at com.mopub.mobileads.MoPubRewardedVideos.showRewardedVideo(MoPubRewardedVideos.java:77)
        // at com.mopub.mobileads.MoPubRewardedVideos.showRewardedVideo(MoPubRewardedVideos.java:103)
        // at com.mopub.unity.MoPubRewardedVideoUnityPlugin$2.run(MoPubRewardedVideoUnityPlugin.java:122)
        // at com.mopub.unity.MoPubUnityPlugin$10.run(MoPubUnityPlugin.java:526)
        // at android.os.Handler.handleCallback(Handler.java:790)
        // at android.os.Handler.dispatchMessage(Handler.java:99)
        // at android.os.Looper.loop(Looper.java:164)
        // at android.app.ActivityThread.main(ActivityThread.java:6494)
        // at java.lang.reflect.Method.invoke(Native Method)
        // at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:438)
        // at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:807)
        SendMessage("UnityFacebookSDKPlugin", "UnityFacebookSDKPlugin", "{\"key_hash\":\"NgS2u0aEWjJAWRbMgtyAolzO6s8=\\n\"}");
        SendMessage("MoPubManager", "EmitSdkInitializedEvent", "[\"0fe07d2ca88549ff9598aed6c45f0773\",\"70\"]");
        SendMessage("MoPubManager", "EmitInterstitialLoadedEvent", "[\"a44632b619174dfa98c46420592a3756\"]");
        SendMessage('MoPubManager', 'EmitAdLoadedEvent', '["f7a8241fad1041bda59f303eae75be2d","320","50"]');
        SendMessage("MoPubManager", "EmitRewardedVideoLoadedEvent", "[\"a44632b619174dfa98c46420592a3756\"]");
        SendMessage("MoPubManager", "EmitRewardedVideoShownEvent", "[\"a44632b619174dfa98c46420592a3756\"]");
        // SendMessage("MoPubManager", "EmitRewardedVideoReceivedRewardEvent", "[\"a44632b619174dfa98c46420592a3756\"]")
        SendMessage('MoPubManager', 'EmitRewardedVideoReceivedRewardEvent', '["a44632b619174dfa98c46420592a3756","","0"]');
        SendMessage("MoPubManager", "EmitRewardedVideoClosedEvent", "[\"a44632b619174dfa98c46420592a3756\"]");
    }
    function TTPluginsGameObject() {
        SendMessage("TTPluginsGameObject", "OnRewardedAdsShown", "");
        SendMessage("TTPluginsGameObject", "OnRewardedAdsClosed", "{\"shouldReward\":true,\"network\":\"admob-unityads\",\"revenue\":0.00138,\"currency\":\"USD\",\"precision\":\"ESTIMATED\"}");
        SendMessage("TTPluginsGameObject", "OnRewardedAdsReady", "{\"loaded\":true}");
    }
};
/**
 * 大于最大出现次数返回值为 -1
 * 主要是为了过滤比如setActive中重复出现的一直频繁调用的obj
 * @param {String} objstr 重复出现的str
 * @param {int} maxCount 最大出现次数
 * @returns ? -1
 */
const filterDuplicateOBJ = (objstr, maxCount = 10) => {
    if (!(0, globle_1.GET_MAP)(enum_1.MapKAY.outFilterMap).has(objstr)) {
        (0, globle_1.SET_MAP_VALUE)(enum_1.MapKAY.outFilterMap, objstr, 0);
        return 0;
    }
    let count = Number((0, globle_1.GET_MAP_VALUE)(enum_1.MapKAY.outFilterMap, objstr)) + 1;
    (0, globle_1.SET_MAP_VALUE)(enum_1.MapKAY.outFilterMap, objstr, count);
    return (count >= maxCount) ? -1 : count;
};
exports.filterDuplicateOBJ = filterDuplicateOBJ;
Number.prototype.add = (num) => {
    return Number(this) + Number(num);
};
globalThis.d = detachAll;
globalThis.A = attachNative;
globalThis.n = nopFunction;
globalThis.nn = cancelNop;
globalThis.nnn = cancelAllNopedFunction;
globalThis.R = replaceFunction;
globalThis.getJclassName = getJclassName;
globalThis.checkCtx = checkCtx;
// globalThis.filterDuplicateOBJ = filterDuplicateOBJ
globalThis.runOnMain = runOnMain;
globalThis.SendMessage = SendMessage;
globalThis.SendMessageImpl = SendMessageImpl;
},{"../base/enum":5,"../base/globle":6}],133:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printCtx = void 0;
const enum_1 = require("../base/enum");
/**
 * 展示代码上下文
 * @param {Pointer} mPtr 指针位置
 * @param {Int} range 展示的范围
 * @param {Int} type 1:正向 2:反向(小端存储，同IDA)   不填写着以当前pointer为中心位置打印信息
 */
var printCtx = (mPtr, range = 5, type = 0, redLine = enum_1.LogColor.WHITE, space = 0) => {
    if (Process.arch != "arm")
        return;
    mPtr = checkPointer(mPtr);
    if (mPtr.isNull())
        return;
    if (type != 0) {
        for (let offset = 0; offset < range; offset++)
            printLOG(mPtr, offset);
    }
    else {
        let max = range == undefined ? 5 : (range % 2 == 1 ? (range + 1) : range) / 2;
        let min = range == undefined ? -4 : max - range;
        for (let offset = min; offset < max; offset++)
            printLOG(mPtr, offset);
    }
    function printLOG(pointer, offset) {
        let cur_p = pointer.add(p_size * offset);
        let cur_value = String(cur_p.readPointer());
        // fix 12 00 00 0A => 0x0A00012 少一个0的情况 
        if (Process.arch == "arm" && cur_value.length != 10)
            cur_value = cur_value.replace("000", "0000");
        let cur_tmp = Array.from(cur_value.toUpperCase());
        let cur_str = (cur_tmp.length == 10) ? cur_value : "";
        if (type == 1) {
            cur_str = cur_tmp[2] + cur_tmp[3] + ' ' + cur_tmp[4] + cur_tmp[5] + ' ' + cur_tmp[6] + cur_tmp[7] + ' ' + cur_tmp[8] + cur_tmp[9];
        }
        else if (type == 2) {
            cur_str = cur_tmp[8] + cur_tmp[9] + ' ' + cur_tmp[6] + cur_tmp[7] + ' ' + cur_tmp[4] + cur_tmp[5] + ' ' + cur_tmp[2] + cur_tmp[3];
        }
        try {
            LOG(getLine(space, "\t") + cur_p + "\t" + cur_str + "\t" + Instruction.parse(cur_p), redLine);
        }
        catch (e) { }
    }
};
exports.printCtx = printCtx;
globalThis.printCtx = printCtx;
},{"../base/enum":5}],134:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formartClass = void 0;
const enum_1 = require("../base/enum");
class formartClass {
    static printTitile = (strTitle, Line1 = enum_1.LogColor.C33, Line2 = enum_1.LogColor.C33, Line3 = enum_1.LogColor.C33) => {
        let len = strTitle.length + 2;
        LOG(` ${getLine(len)} `, Line1);
        LOG(`| ${strTitle} |`, Line2);
        LOG(` ${getLine(len)} `, Line3);
        return len;
    };
    static linesMap = new Map();
    static getLine = (length, fillStr = "-") => {
        let key = length + "|" + fillStr;
        if (formartClass.linesMap.get(key) != null)
            return formartClass.linesMap.get(key);
        for (var index = 0, tmpRet = ""; index < length; index++)
            tmpRet += fillStr;
        formartClass.linesMap.set(key, tmpRet);
        return tmpRet;
    };
    static alignStr(str, size = 13, fillStr = ".") {
        let srcSize = str.length;
        if (srcSize >= size) {
            str = str.substring(0, size - 1);
            str += fillStr;
        }
        else
            for (let i = size - srcSize; i > 0; i--)
                str += " ";
        return str;
    }
    /**
     * 字符串指定位置添加元素
     * @param str1:原字符串
     * @param n:插入位置
     * @param str2:插入元素
     * @return  拼接后的字符串
     */
    static insertStr(str1, n, str2) {
        var s1 = '';
        var s2 = '';
        if (str1.length < n) {
            return str1 + "" + str2;
        }
        else {
            s1 = str1.substring(0, n);
            s2 = str1.substring(n, str1.length);
            return `${s1}${str2}${s2}`;
        }
    }
    static getPtrFormart = (ptr, size = String(Il2Cpp.module.base).length) => {
        let str = ptr.toString(16);
        if (str.length > size)
            return str.substring(0, size - 1) + ".";
        for (let i = size - str.length; i > 0; i--)
            str += " ";
        return `0x${str}`;
    };
}
exports.formartClass = formartClass;
globalThis.insertStr = formartClass.insertStr;
},{"../base/enum":5}],135:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLine = exports.printLogColors = exports.LOGZ = exports.LOGH = exports.LOGO = exports.LOGD = exports.LOGE = exports.LOGW = exports.LOGS = exports.LOG = void 0;
const enum_1 = require("../base/enum");
const globle_1 = require("../base/globle");
const formart_1 = require("./formart");
const setNeedLog = (flag) => (0, globle_1.SET_G)(enum_1.GKEY.LogFlag, flag);
const getNeedLog = () => (0, globle_1.GET_GT)(enum_1.GKEY.LogFlag);
const LOG = (str, type = enum_1.LogColor.WHITE) => {
    switch (type) {
        case enum_1.LogColor.WHITE:
            console.log(str);
            break;
        case enum_1.LogColor.RED:
            console.error(str);
            break;
        case enum_1.LogColor.YELLOW:
            console.warn(str);
            break;
        default:
            console.log("\x1b[" + type + "m" + str + "\x1b[0m");
            break;
    }
};
exports.LOG = LOG;
const colorEndDes = "\x1b[0m";
const colorStartDes = (color) => {
    return `\x1b[${color}m`;
};
// not used
const LOGS = (str, colorDescription = [[0, str.length, enum_1.LogColor.RED]]) => {
    let localStr = str;
    for (let i = 0; i < colorDescription.length; i++) {
        const [start, end, color] = colorDescription[i];
        let strStart = colorStartDes(color);
        localStr = formart_1.formartClass.insertStr(localStr, start, strStart);
        localStr = formart_1.formartClass.insertStr(localStr, end + strStart.length, colorEndDes);
    }
    console.log(localStr);
};
exports.LOGS = LOGS;
const LOGW = (msg) => (0, exports.LOG)(msg, enum_1.LogColor.YELLOW);
exports.LOGW = LOGW;
const LOGE = (msg) => (0, exports.LOG)(msg, enum_1.LogColor.RED);
exports.LOGE = LOGE;
const LOGD = (msg) => (0, exports.LOG)(msg, enum_1.LogColor.C36);
exports.LOGD = LOGD;
const LOGO = (msg) => (0, exports.LOG)(msg, enum_1.LogColor.C33);
exports.LOGO = LOGO;
const LOGH = (msg) => (0, exports.LOG)(msg, enum_1.LogColor.C96);
exports.LOGH = LOGH;
const LOGZ = (msg) => (0, exports.LOG)(msg, enum_1.LogColor.C90);
exports.LOGZ = LOGZ;
function printLogColors() {
    let str = "123456789";
    console.log("----------------  listLogColors  ----------------");
    for (let i = 30; i <= 37; i++) {
        console.log(`\t\t${colorStartDes(i)} C${i}\t${str} ${colorEndDes}`);
    }
    console.log("----------------------------------------------");
    for (let i = 40; i <= 47; i++) {
        console.log(`\t\t${colorStartDes(i)} C${i}\t${str} ${colorEndDes}`);
    }
    console.log("----------------------------------------------");
    for (let i = 90; i <= 97; i++) {
        console.log(`\t\t${colorStartDes(i)} C${i}\t${str} ${colorEndDes}`);
    }
    console.log("----------------------------------------------");
    for (let i = 100; i <= 107; i++) {
        console.log(`\t\t${colorStartDes(i)} C${i}\t${str} ${colorEndDes}`);
    }
    console.log("----------------------------------------------");
}
exports.printLogColors = printLogColors;
let linesMap = new Map();
const getLine = (length, fillStr = "-") => {
    if (length == 0)
        return "";
    let key = length + "|" + fillStr;
    if (linesMap.get(key) != null)
        return linesMap.get(key);
    for (var index = 0, tmpRet = ""; index < length; index++)
        tmpRet += fillStr;
    linesMap.set(key, tmpRet);
    return tmpRet;
};
exports.getLine = getLine;
globalThis.LOG = exports.LOG;
// globalThis.LOGS = LOGS
globalThis.LOGW = exports.LOGW;
globalThis.LOGE = exports.LOGE;
globalThis.LOGD = exports.LOGD;
globalThis.LOGO = exports.LOGO;
globalThis.LOGH = exports.LOGH;
globalThis.LOGZ = exports.LOGZ;
globalThis.getLine = exports.getLine;
globalThis.printLogColors = printLogColors;
globalThis.LogColor = enum_1.LogColor;
},{"../base/enum":5,"../base/globle":6,"./formart":134}],136:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Random = exports.randomSeed = void 0;
function randomSeed() {
    return Math.floor(Math.random() * 2 ** 31);
}
exports.randomSeed = randomSeed;
class Random {
    seed;
    constructor(seed) {
        this.seed = seed;
    }
    next = () => this.seed ? ((2 ** 31 - 1) & (this.seed = Math.imul(48271, this.seed))) / 2 ** 31 : Math.random();
    nextInt = (min, max) => Math.floor(this.next() * (max - min + 1) + min);
}
exports.Random = Random;
},{}],137:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFloat = exports.seeHexA = exports.seeHexR = exports.showArray = exports.readU16 = exports.readInt64 = exports.readUInt64 = exports.readUInt = exports.readInt = exports.readBoolean = exports.readSingle = void 0;
const enum_1 = require("../base/enum");
const common_1 = require("./common");
// 读取浮点数 ptr().readFloat() === readSingle(ptr().readPointer())
const readSingle = (value) => alloc(2).writePointer(value).readFloat();
exports.readSingle = readSingle;
const readBoolean = (value) => alloc(0.25).writePointer(value).readU8() == 0x1;
exports.readBoolean = readBoolean;
const readInt = (value) => alloc().writePointer(value).readInt();
exports.readInt = readInt;
const readUInt = (value) => alloc(1).writePointer(value).readUInt();
exports.readUInt = readUInt;
const readInt64 = (value) => alloc(2).writePointer(value).readS64();
exports.readInt64 = readInt64;
const readUInt64 = (value) => alloc(2).writePointer(value).readU64();
exports.readUInt64 = readUInt64;
/**
 * 读取 c# 字符串
 * @param {Number} mPtr c#字符串指针}
 */
const readU16 = (mPtr) => {
    if (typeof mPtr == "number")
        mPtr = ptr(mPtr);
    if (mPtr == undefined || mPtr == ptr(0))
        return "";
    try {
        return mPtr.add(p_size * 2 + 4).readUtf16String();
    }
    catch (e) {
        return "";
    }
};
exports.readU16 = readU16;
const showArray = (mPtr) => {
    if (typeof mPtr == "number")
        mPtr = ptr(mPtr);
    if (mPtr == undefined || mPtr == ptr(0))
        return;
    let retPtr = mPtr;
    let arrLength = retPtr.add(p_size * 3).readUInt();
    LOGD("\n[*] Array length : " + arrLength + "  |  RET => " + retPtr + "\n");
    if (arrLength == 0)
        return;
    seeHexA(retPtr.add(p_size * 4), (arrLength > 32 ? 32 : arrLength) * p_size, false, enum_1.LogColor.C33);
    LOG("\n");
    for (let i = 0; i < arrLength; ++i) {
        let tmpPtr = retPtr.add(p_size * (4 + i));
        let ObjToString = callFunctionRUS(find_method("mscorlib", "Object", "ToString", 0), tmpPtr.readPointer());
        if (ObjToString == "UnityEngine.UI.Text")
            ObjToString += ("\t" + callFunctionRUS(find_method("UnityEngine.UI", "Text", "get_text", 0), tmpPtr.readPointer()));
        LOGD(String("[" + i + "]").padEnd(5, " ") + " " + tmpPtr + " ---> " + tmpPtr.readPointer() + "  |  " + ObjToString);
    }
    LOG("\n");
};
exports.showArray = showArray;
var seeHexR = (addr, length = 0x40, color) => {
    addr = (0, common_1.PTR2NativePtr)(addr);
    LOG(hexdump(addr.readPointer(), {
        length: length
    }), color == undefined ? enum_1.LogColor.WHITE : color);
};
exports.seeHexR = seeHexR;
var seeHexA = (addr, length = 0x40, header = true, color) => {
    addr = (0, common_1.PTR2NativePtr)(addr);
    LOG(hexdump(addr, {
        length: length,
        header: header,
    }), color == undefined ? enum_1.LogColor.WHITE : color);
};
exports.seeHexA = seeHexA;
const getFloat = (intNum) => alloc(1).writeFloat(intNum).readPointer();
exports.getFloat = getFloat;
globalThis.readSingle = readSingle;
globalThis.readBoolean = readBoolean;
globalThis.readInt = readInt;
globalThis.readUInt = readUInt;
globalThis.readInt64 = readInt64;
globalThis.readUInt64 = readUInt64;
globalThis.readU16 = readU16;
globalThis.showArray = showArray;
globalThis.seeHexR = seeHexR;
globalThis.seeHexA = seeHexA;
},{"../base/enum":5,"./common":132}],138:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetStackTraceN = exports.GetStackTrace = exports.PrintStackTraceN = exports.PrintStackTrace = void 0;
// 打印java堆栈
const PrintStackTrace = () => LOG(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()), LogColor.C36);
exports.PrintStackTrace = PrintStackTrace;
// 打印native堆栈
const PrintStackTraceN = (ctx, retText = false, slice = 6, reverse = false) => {
    let tmpText = "";
    if (reverse) {
        tmpText = Thread.backtrace(ctx, Backtracer.FUZZY)
            .slice(0, slice)
            .reverse()
            .map(DebugSymbol.fromAddress).join("\n");
    }
    else {
        tmpText = Thread.backtrace(ctx, Backtracer.FUZZY)
            .slice(0, slice)
            .map(DebugSymbol.fromAddress).join("\n");
    }
    return !retText ? LOGD(tmpText) : tmpText;
};
exports.PrintStackTraceN = PrintStackTraceN;
var GetStackTrace = () => Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new());
exports.GetStackTrace = GetStackTrace;
var GetStackTraceN = (ctx, level = 6) => {
    return Thread.backtrace(ctx, Backtracer.FUZZY)
        .slice(0, level)
        // .reverse()
        .map(frame => DebugSymbol.fromAddress(frame))
        // .map(symbol => `${getLine(level==undefined?0:level,"\n")}${symbol}\n`)
        .join("\n");
};
exports.GetStackTraceN = GetStackTraceN;
globalThis.PrintStackTrace = PrintStackTrace;
globalThis.PrintStackTraceN = PrintStackTraceN;
globalThis.GetStackTrace = GetStackTrace;
globalThis.GetStackTraceN = GetStackTraceN;
},{}],139:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
function cache(target, name, descriptor) {
    var getter = descriptor.get;
    if (!getter)
        throw new TypeError("Getter property descriptor expected");
    descriptor.get = function () {
        var value = getter.call(this);
        Object.defineProperty(this, name, {
            configurable: descriptor.configurable,
            enumerable: descriptor.enumerable,
            writable: false,
            value: value
        });
        return value;
    };
}
exports.cache = cache;

},{}],140:[function(require,module,exports){
"use strict";
const peq = new Uint32Array(0x10000);
const myers_32 = (a, b) => {
  const n = a.length;
  const m = b.length;
  const lst = 1 << (n - 1);
  let pv = -1;
  let mv = 0;
  let sc = n;
  let i = n;
  while (i--) {
    peq[a.charCodeAt(i)] |= 1 << i;
  }
  for (i = 0; i < m; i++) {
    let eq = peq[b.charCodeAt(i)];
    const xv = eq | mv;
    eq |= ((eq & pv) + pv) ^ pv;
    mv |= ~(eq | pv);
    pv &= eq;
    if (mv & lst) {
      sc++;
    }
    if (pv & lst) {
      sc--;
    }
    mv = (mv << 1) | 1;
    pv = (pv << 1) | ~(xv | mv);
    mv &= xv;
  }
  i = n;
  while (i--) {
    peq[a.charCodeAt(i)] = 0;
  }
  return sc;
};

const myers_x = (a, b) => {
  const n = a.length;
  const m = b.length;
  const mhc = [];
  const phc = [];
  const hsize = Math.ceil(n / 32);
  const vsize = Math.ceil(m / 32);
  let score = m;
  for (let i = 0; i < hsize; i++) {
    phc[i] = -1;
    mhc[i] = 0;
  }
  let j = 0;
  for (; j < vsize - 1; j++) {
    let mv = 0;
    let pv = -1;
    const start = j * 32;
    const end = Math.min(32, m) + start;
    for (let k = start; k < end; k++) {
      peq[b.charCodeAt(k)] |= 1 << k;
    }
    score = m;
    for (let i = 0; i < n; i++) {
      const eq = peq[a.charCodeAt(i)];
      const pb = (phc[(i / 32) | 0] >>> i) & 1;
      const mb = (mhc[(i / 32) | 0] >>> i) & 1;
      const xv = eq | mv;
      const xh = ((((eq | mb) & pv) + pv) ^ pv) | eq | mb;
      let ph = mv | ~(xh | pv);
      let mh = pv & xh;
      if ((ph >>> 31) ^ pb) {
        phc[(i / 32) | 0] ^= 1 << i;
      }
      if ((mh >>> 31) ^ mb) {
        mhc[(i / 32) | 0] ^= 1 << i;
      }
      ph = (ph << 1) | pb;
      mh = (mh << 1) | mb;
      pv = mh | ~(xv | ph);
      mv = ph & xv;
    }
    for (let k = start; k < end; k++) {
      peq[b.charCodeAt(k)] = 0;
    }
  }
  let mv = 0;
  let pv = -1;
  const start = j * 32;
  const end = Math.min(32, m - start) + start;
  for (let k = start; k < end; k++) {
    peq[b.charCodeAt(k)] |= 1 << k;
  }
  score = m;
  for (let i = 0; i < n; i++) {
    const eq = peq[a.charCodeAt(i)];
    const pb = (phc[(i / 32) | 0] >>> i) & 1;
    const mb = (mhc[(i / 32) | 0] >>> i) & 1;
    const xv = eq | mv;
    const xh = ((((eq | mb) & pv) + pv) ^ pv) | eq | mb;
    let ph = mv | ~(xh | pv);
    let mh = pv & xh;
    score += (ph >>> (m - 1)) & 1;
    score -= (mh >>> (m - 1)) & 1;
    if ((ph >>> 31) ^ pb) {
      phc[(i / 32) | 0] ^= 1 << i;
    }
    if ((mh >>> 31) ^ mb) {
      mhc[(i / 32) | 0] ^= 1 << i;
    }
    ph = (ph << 1) | pb;
    mh = (mh << 1) | mb;
    pv = mh | ~(xv | ph);
    mv = ph & xv;
  }
  for (let k = start; k < end; k++) {
    peq[b.charCodeAt(k)] = 0;
  }
  return score;
};

const distance = (a, b) => {
  if (a.length > b.length) {
    const tmp = b;
    b = a;
    a = tmp;
  }
  if (a.length === 0) {
    return b.length;
  }
  if (a.length <= 32) {
    return myers_32(a, b);
  }
  return myers_x(a, b);
};

const closest = (str, arr) => {
  let min_distance = Infinity;
  let min_index = 0;
  for (let i = 0; i < arr.length; i++) {
    const dist = distance(str, arr[i]);
    if (dist < min_distance) {
      min_distance = dist;
      min_index = i;
    }
  }
  return arr[min_index];
};

module.exports = {
  closest, distance
}

},{}],141:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_cache_getter_1 = require("decorator-cache-getter");
const versioning_1 = __importDefault(require("versioning"));
const console_1 = require("../utils/console");
class Il2CppApi {
    constructor() { }
    static get _alloc() {
        return this.r("il2cpp_alloc", "pointer", ["size_t"]);
    }
    static get _arrayGetElements() {
        return this.r("il2cpp_array_get_elements", "pointer", ["pointer"]);
    }
    static get _arrayGetLength() {
        return this.r("il2cpp_array_length", "uint32", ["pointer"]);
    }
    static get _arrayNew() {
        return this.r("il2cpp_array_new", "pointer", ["pointer", "uint32"]);
    }
    static get _assemblyGetImage() {
        return this.r("il2cpp_assembly_get_image", "pointer", ["pointer"]);
    }
    static get _classForEach() {
        return this.r("il2cpp_class_for_each", "void", ["pointer", "pointer"]);
    }
    static get _classFromName() {
        return this.r("il2cpp_class_from_name", "pointer", ["pointer", "pointer", "pointer"]);
    }
    static get _classFromSystemType() {
        return this.r("il2cpp_class_from_system_type", "pointer", ["pointer"]);
    }
    static get _classFromType() {
        return this.r("il2cpp_class_from_type", "pointer", ["pointer"]);
    }
    static get _classGetActualInstanceSize() {
        return this.r("il2cpp_class_get_actual_instance_size", "int32", ["pointer"]);
    }
    static get _classGetArrayClass() {
        return this.r("il2cpp_array_class_get", "pointer", ["pointer", "uint32"]);
    }
    static get _classGetArrayElementSize() {
        return this.r("il2cpp_class_array_element_size", "int", ["pointer"]);
    }
    static get _classGetAssemblyName() {
        return this.r("il2cpp_class_get_assemblyname", "pointer", ["pointer"]);
    }
    static get _classGetBaseType() {
        return this.r("il2cpp_class_enum_basetype", "pointer", ["pointer"]);
    }
    static get _classGetDeclaringType() {
        return this.r("il2cpp_class_get_declaring_type", "pointer", ["pointer"]);
    }
    static get _classGetElementClass() {
        return this.r("il2cpp_class_get_element_class", "pointer", ["pointer"]);
    }
    static get _classGetFieldFromName() {
        return this.r("il2cpp_class_get_field_from_name", "pointer", ["pointer", "pointer"]);
    }
    static get _classGetFields() {
        return this.r("il2cpp_class_get_fields", "pointer", ["pointer", "pointer"]);
    }
    static get _classGetFlags() {
        return this.r("il2cpp_class_get_flags", "int", ["pointer"]);
    }
    static get _classGetImage() {
        return this.r("il2cpp_class_get_image", "pointer", ["pointer"]);
    }
    static get _classGetInstanceSize() {
        return this.r("il2cpp_class_instance_size", "int32", ["pointer"]);
    }
    static get _classGetInterfaces() {
        return this.r("il2cpp_class_get_interfaces", "pointer", ["pointer", "pointer"]);
    }
    static get _classGetMethodFromName() {
        return this.r("il2cpp_class_get_method_from_name", "pointer", ["pointer", "pointer", "int"]);
    }
    static get _classGetMethods() {
        return this.r("il2cpp_class_get_methods", "pointer", ["pointer", "pointer"]);
    }
    static get _classGetName() {
        return this.r("il2cpp_class_get_name", "pointer", ["pointer"]);
    }
    static get _classGetNamespace() {
        return this.r("il2cpp_class_get_namespace", "pointer", ["pointer"]);
    }
    static get _classGetNestedClasses() {
        return this.r("il2cpp_class_get_nested_types", "pointer", ["pointer", "pointer"]);
    }
    static get _classGetParent() {
        return this.r("il2cpp_class_get_parent", "pointer", ["pointer"]);
    }
    static get _classGetRank() {
        return this.r("il2cpp_class_get_rank", "int", ["pointer"]);
    }
    static get _classGetStaticFieldData() {
        return this.r("il2cpp_class_get_static_field_data", "pointer", ["pointer"]);
    }
    static get _classGetValueSize() {
        return this.r("il2cpp_class_value_size", "int32", ["pointer", "pointer"]);
    }
    static get _classGetType() {
        return this.r("il2cpp_class_get_type", "pointer", ["pointer"]);
    }
    static get _classHasReferences() {
        return this.r("il2cpp_class_has_references", "bool", ["pointer"]);
    }
    static get _classInit() {
        return this.r("il2cpp_runtime_class_init", "void", ["pointer"]);
    }
    static get _classIsAbstract() {
        return this.r("il2cpp_class_is_abstract", "bool", ["pointer"]);
    }
    static get _classIsAssignableFrom() {
        return this.r("il2cpp_class_is_assignable_from", "bool", ["pointer", "pointer"]);
    }
    static get _classIsBlittable() {
        return this.r("il2cpp_class_is_blittable", "bool", ["pointer"]);
    }
    static get _classIsEnum() {
        return this.r("il2cpp_class_is_enum", "bool", ["pointer"]);
    }
    static get _classIsGeneric() {
        return this.r("il2cpp_class_is_generic", "bool", ["pointer"]);
    }
    static get _classIsInflated() {
        return this.r("il2cpp_class_is_inflated", "bool", ["pointer"]);
    }
    static get _classIsInterface() {
        return this.r("il2cpp_class_is_interface", "bool", ["pointer"]);
    }
    static get _classIsSubclassOf() {
        return this.r("il2cpp_class_is_subclass_of", "bool", ["pointer", "pointer", "bool"]);
    }
    static get _classIsValueType() {
        return this.r("il2cpp_class_is_valuetype", "bool", ["pointer"]);
    }
    static get _domainAssemblyOpen() {
        return this.r("il2cpp_domain_assembly_open", "pointer", ["pointer", "pointer"]);
    }
    static get _domainGet() {
        return this.r("il2cpp_domain_get", "pointer", []);
    }
    static get _domainGetAssemblies() {
        return this.r("il2cpp_domain_get_assemblies", "pointer", ["pointer", "pointer"]);
    }
    static get _fieldGetModifier() {
        return this.r("il2cpp_field_get_modifier", "pointer", ["pointer"]);
    }
    static get _fieldGetClass() {
        return this.r("il2cpp_field_get_parent", "pointer", ["pointer"]);
    }
    static get _fieldGetFlags() {
        return this.r("il2cpp_field_get_flags", "int", ["pointer"]);
    }
    static get _fieldGetName() {
        return this.r("il2cpp_field_get_name", "pointer", ["pointer"]);
    }
    static get _fieldGetOffset() {
        return this.r("il2cpp_field_get_offset", "int32", ["pointer"]);
    }
    static get _fieldGetStaticValue() {
        return this.r("il2cpp_field_static_get_value", "void", ["pointer", "pointer"]);
    }
    static get _fieldGetType() {
        return this.r("il2cpp_field_get_type", "pointer", ["pointer"]);
    }
    static get _fieldIsLiteral() {
        return this.r("il2cpp_field_is_literal", "bool", ["pointer"]);
    }
    static get _fieldIsStatic() {
        return this.r("il2cpp_field_is_static", "bool", ["pointer"]);
    }
    static get _fieldIsThreadStatic() {
        return this.r("il2cpp_field_is_thread_static", "bool", ["pointer"]);
    }
    static get _fieldSetStaticValue() {
        return this.r("il2cpp_field_static_set_value", "void", ["pointer", "pointer"]);
    }
    static get _free() {
        return this.r("il2cpp_free", "void", ["pointer"]);
    }
    static get _gcCollect() {
        return this.r("il2cpp_gc_collect", "void", ["int"]);
    }
    static get _gcCollectALittle() {
        return this.r("il2cpp_gc_collect_a_little", "void", []);
    }
    static get _gcDisable() {
        return this.r("il2cpp_gc_disable", "void", []);
    }
    static get _gcEnable() {
        return this.r("il2cpp_gc_enable", "void", []);
    }
    static get _gcGetHeapSize() {
        return this.r("il2cpp_gc_get_heap_size", "int64", []);
    }
    static get _gcGetMaxTimeSlice() {
        return this.r("il2cpp_gc_get_max_time_slice_ns", "int64", []);
    }
    static get _gcGetUsedSize() {
        return this.r("il2cpp_gc_get_used_size", "int64", []);
    }
    static get _gcHandleGetTarget() {
        return this.r("il2cpp_gchandle_get_target", "pointer", ["uint32"]);
    }
    static get _gcHandleFree() {
        return this.r("il2cpp_gchandle_free", "void", ["uint32"]);
    }
    static get _gcHandleNew() {
        return this.r("il2cpp_gchandle_new", "uint32", ["pointer", "bool"]);
    }
    static get _gcHandleNewWeakRef() {
        return this.r("il2cpp_gchandle_new_weakref", "uint32", ["pointer", "bool"]);
    }
    static get _gcIsDisabled() {
        return this.r("il2cpp_gc_is_disabled", "bool", []);
    }
    static get _gcIsIncremental() {
        return this.r("il2cpp_gc_is_incremental", "bool", []);
    }
    static get _gcSetMaxTimeSlice() {
        return this.r("il2cpp_gc_set_max_time_slice_ns", "void", ["int64"]);
    }
    static get _gcStartIncrementalCollection() {
        return this.r("il2cpp_gc_start_incremental_collection", "void", []);
    }
    static get _gcStartWorld() {
        return this.r("il2cpp_start_gc_world", "void", []);
    }
    static get _gcStopWorld() {
        return this.r("il2cpp_stop_gc_world", "void", []);
    }
    static get _getCorlib() {
        return this.r("il2cpp_get_corlib", "pointer", []);
    }
    static get _imageGetAssembly() {
        return this.r("il2cpp_image_get_assembly", "pointer", ["pointer"]);
    }
    static get _imageGetClass() {
        return this.r("il2cpp_image_get_class", "pointer", ["pointer", "uint"]);
    }
    static get _imageGetClassCount() {
        return this.r("il2cpp_image_get_class_count", "uint32", ["pointer"]);
    }
    static get _imageGetName() {
        return this.r("il2cpp_image_get_name", "pointer", ["pointer"]);
    }
    static get _init() {
        return this.r("il2cpp_init", "void", []);
    }
    static get _livenessAllocateStruct() {
        return this.r("il2cpp_unity_liveness_allocate_struct", "pointer", ["pointer", "int", "pointer", "pointer", "pointer"]);
    }
    static get _livenessCalculationBegin() {
        return this.r("il2cpp_unity_liveness_calculation_begin", "pointer", ["pointer", "int", "pointer", "pointer", "pointer", "pointer"]);
    }
    static get _livenessCalculationEnd() {
        return this.r("il2cpp_unity_liveness_calculation_end", "void", ["pointer"]);
    }
    static get _livenessCalculationFromStatics() {
        return this.r("il2cpp_unity_liveness_calculation_from_statics", "void", ["pointer"]);
    }
    static get _livenessFinalize() {
        return this.r("il2cpp_unity_liveness_finalize", "void", ["pointer"]);
    }
    static get _livenessFreeStruct() {
        return this.r("il2cpp_unity_liveness_free_struct", "void", ["pointer"]);
    }
    static get _memorySnapshotCapture() {
        return this.r("il2cpp_capture_memory_snapshot", "pointer", []);
    }
    static get _memorySnapshotFree() {
        return this.r("il2cpp_free_captured_memory_snapshot", "void", ["pointer"]);
    }
    static get _memorySnapshotGetClasses() {
        return this.r("il2cpp_memory_snapshot_get_classes", "pointer", ["pointer", "pointer"]);
    }
    static get _memorySnapshotGetGCHandles() {
        return this.r("il2cpp_memory_snapshot_get_gc_handles", ["uint32", "pointer"], ["pointer"]);
    }
    static get _memorySnapshotGetRuntimeInformation() {
        return this.r("il2cpp_memory_snapshot_get_information", ["uint32", "uint32", "uint32", "uint32", "uint32", "uint32"], ["pointer"]);
    }
    static get _methodGetModifier() {
        return this.r("il2cpp_method_get_modifier", "pointer", ["pointer"]);
    }
    static get _methodGetClass() {
        return this.r("il2cpp_method_get_class", "pointer", ["pointer"]);
    }
    static get _methodGetFlags() {
        return this.r("il2cpp_method_get_flags", "uint32", ["pointer", "pointer"]);
    }
    static get _methodGetFromReflection() {
        return this.r("il2cpp_method_get_from_reflection", "pointer", ["pointer"]);
    }
    static get _methodGetName() {
        return this.r("il2cpp_method_get_name", "pointer", ["pointer"]);
    }
    static get _methodGetObject() {
        return this.r("il2cpp_method_get_object", "pointer", ["pointer", "pointer"]);
    }
    static get _methodGetParameterCount() {
        return this.r("il2cpp_method_get_param_count", "uint8", ["pointer"]);
    }
    static get _methodGetParameterName() {
        return this.r("il2cpp_method_get_param_name", "pointer", ["pointer", "uint32"]);
    }
    static get _methodGetParameters() {
        return this.r("il2cpp_method_get_parameters", "pointer", ["pointer", "pointer"]);
    }
    static get _methodGetParameterType() {
        return this.r("il2cpp_method_get_param", "pointer", ["pointer", "uint32"]);
    }
    static get _methodGetPointer() {
        return this.r("il2cpp_method_get_pointer", "pointer", ["pointer"]);
    }
    static get _methodGetReturnType() {
        return this.r("il2cpp_method_get_return_type", "pointer", ["pointer"]);
    }
    static get _methodIsExternal() {
        return this.r("il2cpp_method_is_external", "bool", ["pointer"]);
    }
    static get _methodIsGeneric() {
        return this.r("il2cpp_method_is_generic", "bool", ["pointer"]);
    }
    static get _methodIsInflated() {
        return this.r("il2cpp_method_is_inflated", "bool", ["pointer"]);
    }
    static get _methodIsInstance() {
        return this.r("il2cpp_method_is_instance", "bool", ["pointer"]);
    }
    static get _methodIsSynchronized() {
        return this.r("il2cpp_method_is_synchronized", "bool", ["pointer"]);
    }
    static get _monitorEnter() {
        return this.r("il2cpp_monitor_enter", "void", ["pointer"]);
    }
    static get _monitorExit() {
        return this.r("il2cpp_monitor_exit", "void", ["pointer"]);
    }
    static get _monitorPulse() {
        return this.r("il2cpp_monitor_pulse", "void", ["pointer"]);
    }
    static get _monitorPulseAll() {
        return this.r("il2cpp_monitor_pulse_all", "void", ["pointer"]);
    }
    static get _monitorTryEnter() {
        return this.r("il2cpp_monitor_try_enter", "bool", ["pointer", "uint32"]);
    }
    static get _monitorTryWait() {
        return this.r("il2cpp_monitor_try_wait", "bool", ["pointer", "uint32"]);
    }
    static get _monitorWait() {
        return this.r("il2cpp_monitor_wait", "void", ["pointer"]);
    }
    static get _objectGetClass() {
        return this.r("il2cpp_object_get_class", "pointer", ["pointer"]);
    }
    static get _objectGetVirtualMethod() {
        return this.r("il2cpp_object_get_virtual_method", "pointer", ["pointer", "pointer"]);
    }
    static get _objectInit() {
        return this.r("il2cpp_runtime_object_init_exception", "void", ["pointer", "pointer"]);
    }
    static get _objectNew() {
        return this.r("il2cpp_object_new", "pointer", ["pointer"]);
    }
    static get _objectGetSize() {
        return this.r("il2cpp_object_get_size", "uint32", ["pointer"]);
    }
    static get _objectUnbox() {
        return this.r("il2cpp_object_unbox", "pointer", ["pointer"]);
    }
    static get _resolveInternalCall() {
        return this.r("il2cpp_resolve_icall", "pointer", ["pointer"]);
    }
    static get _stringChars() {
        return this.r("il2cpp_string_chars", "pointer", ["pointer"]);
    }
    static get _stringLength() {
        return this.r("il2cpp_string_length", "int32", ["pointer"]);
    }
    static get _stringNew() {
        return this.r("il2cpp_string_new", "pointer", ["pointer"]);
    }
    static get _stringSetLength() {
        return this.r("il2cpp_string_set_length", "void", ["pointer", "int32"]);
    }
    static get _valueBox() {
        return this.r("il2cpp_value_box", "pointer", ["pointer", "pointer"]);
    }
    static get _threadAttach() {
        return this.r("il2cpp_thread_attach", "pointer", ["pointer"]);
    }
    static get _threadCurrent() {
        return this.r("il2cpp_thread_current", "pointer", []);
    }
    static get _threadGetAllAttachedThreads() {
        return this.r("il2cpp_thread_get_all_attached_threads", "pointer", ["pointer"]);
    }
    static get _threadIsVm() {
        return this.r("il2cpp_is_vm_thread", "bool", ["pointer"]);
    }
    static get _threadDetach() {
        return this.r("il2cpp_thread_detach", "void", ["pointer"]);
    }
    static get _typeGetName() {
        return this.r("il2cpp_type_get_name", "pointer", ["pointer"]);
    }
    static get _typeGetObject() {
        return this.r("il2cpp_type_get_object", "pointer", ["pointer"]);
    }
    static get _typeGetTypeEnum() {
        return this.r("il2cpp_type_get_type", "int", ["pointer"]);
    }
    static get _typeIsByReference() {
        return this.r("il2cpp_type_is_byref", "bool", ["pointer"]);
    }
    static get _typeIsPrimitive() {
        return this.r("il2cpp_type_is_primitive", "bool", ["pointer"]);
    }
    /** @internal */
    static get cModule() {
        if (versioning_1.default.lt(Il2Cpp.unityVersion, "5.3.0") || versioning_1.default.gte(Il2Cpp.unityVersion, "2022.2.0")) {
            (0, console_1.warn)(`current Unity version ${Il2Cpp.unityVersion} is not supported, expect breakage`);
        }
        const offsetsFinderCModule = new CModule(`\
#include <stdint.h>

#define OFFSET_OF(name, type) \
    int16_t name (char * p,\
                  type e)\
    {\
        for (int16_t i = 0; i < 512; i++) if (* ((type *) p + i) == e) return i;\
        return -1;\
    }

OFFSET_OF (offset_of_int32, int32_t)
OFFSET_OF (offset_of_pointer, void *)
            `);
        const offsetOfInt32 = new NativeFunction(offsetsFinderCModule.offset_of_int32, "int16", ["pointer", "int32"]);
        const offsetOfPointer = new NativeFunction(offsetsFinderCModule.offset_of_pointer, "int16", ["pointer", "pointer"]);
        const SystemString = Il2Cpp.Image.corlib.class("System.String");
        const SystemDateTime = Il2Cpp.Image.corlib.class("System.DateTime");
        const SystemReflectionModule = Il2Cpp.Image.corlib.class("System.Reflection.Module");
        SystemDateTime.initialize();
        SystemReflectionModule.initialize();
        const DaysToMonth365 = (SystemDateTime.tryField("daysmonth") ??
            SystemDateTime.tryField("DaysToMonth365") ??
            SystemDateTime.field("s_daysToMonth365")).value;
        const FilterTypeName = SystemReflectionModule.field("FilterTypeName").value;
        const FilterTypeNameMethodPointer = FilterTypeName.field("method_ptr").value;
        const FilterTypeNameMethod = FilterTypeName.field("method").value;
        const source = `\
#include <stdint.h>
#include <string.h>


typedef struct _Il2CppObject Il2CppObject;
typedef enum _Il2CppTypeEnum Il2CppTypeEnum;
typedef struct _Il2CppReflectionMethod Il2CppReflectionMethod;
typedef struct _Il2CppManagedMemorySnapshot Il2CppManagedMemorySnapshot;
typedef struct _Il2CppMetadataType Il2CppMetadataType;


struct _Il2CppObject
{
    void * class;
    void * monitor;
};

enum _Il2CppTypeEnum
{
    IL2CPP_TYPE_END = 0x00,
    IL2CPP_TYPE_VOID = 0x01,
    IL2CPP_TYPE_BOOLEAN = 0x02,
    IL2CPP_TYPE_CHAR = 0x03,
    IL2CPP_TYPE_I1 = 0x04,
    IL2CPP_TYPE_U1 = 0x05,
    IL2CPP_TYPE_I2 = 0x06,
    IL2CPP_TYPE_U2 = 0x07,
    IL2CPP_TYPE_I4 = 0x08,
    IL2CPP_TYPE_U4 = 0x09,
    IL2CPP_TYPE_I8 = 0x0a,
    IL2CPP_TYPE_U8 = 0x0b,
    IL2CPP_TYPE_R4 = 0x0c,
    IL2CPP_TYPE_R8 = 0x0d,
    IL2CPP_TYPE_STRING = 0x0e,
    IL2CPP_TYPE_PTR = 0x0f,
    IL2CPP_TYPE_BYREF = 0x10,
    IL2CPP_TYPE_VALUETYPE = 0x11,
    IL2CPP_TYPE_CLASS = 0x12,
    IL2CPP_TYPE_VAR = 0x13,
    IL2CPP_TYPE_ARRAY = 0x14,
    IL2CPP_TYPE_GENERICINST = 0x15,
    IL2CPP_TYPE_TYPEDBYREF = 0x16,
    IL2CPP_TYPE_I = 0x18,
    IL2CPP_TYPE_U = 0x19,
    IL2CPP_TYPE_FNPTR = 0x1b,
    IL2CPP_TYPE_OBJECT = 0x1c,
    IL2CPP_TYPE_SZARRAY = 0x1d,
    IL2CPP_TYPE_MVAR = 0x1e,
    IL2CPP_TYPE_CMOD_REQD = 0x1f,
    IL2CPP_TYPE_CMOD_OPT = 0x20,
    IL2CPP_TYPE_INTERNAL = 0x21,
    IL2CPP_TYPE_MODIFIER = 0x40,
    IL2CPP_TYPE_SENTINEL = 0x41,
    IL2CPP_TYPE_PINNED = 0x45,
    IL2CPP_TYPE_ENUM = 0x55
};

struct _Il2CppReflectionMethod
{
    Il2CppObject object;
    void * method;
    void * name;
    void * reftype;
};

struct _Il2CppManagedMemorySnapshot
{
    struct Il2CppManagedHeap
    {
        uint32_t section_count;
        void * sections;
    } heap;
    struct Il2CppStacks
    {
        uint32_t stack_count;
        void * stacks;
    } stacks;
    struct Il2CppMetadataSnapshot
    {
        uint32_t type_count;
        Il2CppMetadataType * types;
    } metadata_snapshot;
    struct Il2CppGCHandles
    {
        uint32_t tracked_object_count;
        Il2CppObject ** pointers_to_objects;
    } gc_handles;
    struct Il2CppRuntimeInformation
    {
        uint32_t pointer_size;
        uint32_t object_header_size;
        uint32_t array_header_size;
        uint32_t array_bounds_offset_in_header;
        uint32_t array_size_offset_in_header;
        uint32_t allocation_granularity;
    } runtime_information;
    void * additional_user_information;
};

struct _Il2CppMetadataType
{
    uint32_t flags;
    void * fields;
    uint32_t field_count;
    uint32_t statics_size;
    uint8_t * statics;
    uint32_t base_or_element_type_index;
    char * name;
    const char * assembly_name;
    uint64_t type_info_address;
    uint32_t size;
};


#define THREAD_STATIC_FIELD_OFFSET -1;

#define FIELD_ATTRIBUTE_FIELD_ACCESS_MASK 0x0007
#define FIELD_ATTRIBUTE_COMPILER_CONTROLLED 0x0000
#define FIELD_ATTRIBUTE_PRIVATE 0x0001
#define FIELD_ATTRIBUTE_FAM_AND_ASSEM 0x0002
#define FIELD_ATTRIBUTE_ASSEMBLY 0x0003
#define FIELD_ATTRIBUTE_FAMILY 0x0004
#define FIELD_ATTRIBUTE_FAM_OR_ASSEM 0x0005
#define FIELD_ATTRIBUTE_PUBLIC 0x0006

#define FIELD_ATTRIBUTE_STATIC 0x0010
#define FIELD_ATTRIBUTE_LITERAL 0x0040

#define METHOD_ATTRIBUTE_MEMBER_ACCESS_MASK 0x0007
#define METHOD_ATTRIBUTE_COMPILER_CONTROLLED 0x0000
#define METHOD_ATTRIBUTE_PRIVATE 0x0001
#define METHOD_ATTRIBUTE_FAM_AND_ASSEM 0x0002
#define METHOD_ATTRIBUTE_ASSEMBLY 0x0003
#define METHOD_ATTRIBUTE_FAMILY 0x0004
#define METHOD_ATTRIBUTE_FAM_OR_ASSEM 0x0005
#define METHOD_ATTRIBUTE_PUBLIC 0x0006

#define METHOD_ATTRIBUTE_STATIC 0x0010
#define METHOD_IMPL_ATTRIBUTE_INTERNAL_CALL 0x1000
#define METHOD_IMPL_ATTRIBUTE_SYNCHRONIZED 0x0020


static const char * (*il2cpp_class_get_name) (void *) = (void *) ${this._classGetName};
static int (*il2cpp_field_get_flags) (void *) = (void *) ${this._fieldGetFlags};
static size_t (*il2cpp_field_get_offset) (void *) = (void *) ${this._fieldGetOffset};
static uint32_t (*il2cpp_method_get_flags) (void *, uint32_t *) = (void *) ${this._methodGetFlags};
static char * (*il2cpp_type_get_name) (void *) = (void *) ${this._typeGetName};
static Il2CppTypeEnum (*il2cpp_type_get_type_enum) (void *) = (void *) ${this._typeGetTypeEnum};
static void (*il2cpp_free) (void * pointer) = (void *) ${this._free};


void
il2cpp_string_set_length (int32_t * string,
                          int32_t length)
{
    *(string + ${offsetOfInt32(Il2Cpp.String.from("vfsfitvnm"), 9)}) = length;
}

void *
il2cpp_array_get_elements (int32_t * array)
{ 
    return array + ${offsetOfInt32(DaysToMonth365, 31) - 1};
}

uint8_t
il2cpp_type_is_byref (void * type)
{   
    char * name;
    char last_char;

    name = il2cpp_type_get_name (type);
    last_char = name[strlen (name) - 1];

    il2cpp_free (name);
    return last_char == '&';
}

uint8_t
il2cpp_type_is_primitive (void * type)
{
    Il2CppTypeEnum type_enum;

    type_enum = il2cpp_type_get_type_enum (type);

    return ((type_enum >= IL2CPP_TYPE_BOOLEAN && 
        type_enum <= IL2CPP_TYPE_R8) || 
        type_enum == IL2CPP_TYPE_I || 
        type_enum == IL2CPP_TYPE_U
    );
}

int32_t
il2cpp_class_get_actual_instance_size (int32_t * class)
{
    return *(class + ${offsetOfInt32(SystemString, SystemString.instanceSize - 2)});
}

uint8_t
il2cpp_class_get_rank (void * class)
{
    uint8_t rank;
    const char * name;
    
    rank = 0;
    name = il2cpp_class_get_name (class);

    for (uint16_t i = strlen (name) - 1; i > 0; i--)
    {
        char c = name[i];

        if (c == ']') rank++;
        else if (c == '[' || rank == 0) break;
        else if (c == ',') rank++;
        else break;
    }

    return rank;
}

const char *
il2cpp_field_get_modifier (void * field)
{   
    int flags;

    flags = il2cpp_field_get_flags (field);

    switch (flags & FIELD_ATTRIBUTE_FIELD_ACCESS_MASK) {
        case FIELD_ATTRIBUTE_PRIVATE:
            return "private";
        case FIELD_ATTRIBUTE_FAM_AND_ASSEM:
            return "private protected";
        case FIELD_ATTRIBUTE_ASSEMBLY:
            return "internal";
        case FIELD_ATTRIBUTE_FAMILY:
            return "protected";
        case FIELD_ATTRIBUTE_FAM_OR_ASSEM:
            return "protected internal";
        case FIELD_ATTRIBUTE_PUBLIC:
            return "public";
    }

    return "";
}

uint8_t
il2cpp_field_is_literal (void * field)
{
    return (il2cpp_field_get_flags (field) & FIELD_ATTRIBUTE_LITERAL) != 0;
}

uint8_t
il2cpp_field_is_static (void * field)
{
    return (il2cpp_field_get_flags (field) & FIELD_ATTRIBUTE_STATIC) != 0;
}

uint8_t
il2cpp_field_is_thread_static (void * field)
{
    return il2cpp_field_get_offset (field) == THREAD_STATIC_FIELD_OFFSET;
}

const char *
il2cpp_method_get_modifier (void * method)
{
    uint32_t flags;

    flags = il2cpp_method_get_flags (method, NULL);

    switch (flags & METHOD_ATTRIBUTE_MEMBER_ACCESS_MASK) {
        case METHOD_ATTRIBUTE_PRIVATE:
            return "private";
        case METHOD_ATTRIBUTE_FAM_AND_ASSEM:
            return "private protected";
        case METHOD_ATTRIBUTE_ASSEMBLY:
            return "internal";
        case METHOD_ATTRIBUTE_FAMILY:
            return "protected";
        case METHOD_ATTRIBUTE_FAM_OR_ASSEM:
            return "protected internal";
        case METHOD_ATTRIBUTE_PUBLIC:
            return "public";
    }

    return "";
}

void *
il2cpp_method_get_from_reflection (const Il2CppReflectionMethod * method)
{
    return method->method;
}

void *
il2cpp_method_get_pointer (void ** method)
{
    return * (method + ${offsetOfPointer(FilterTypeNameMethod, FilterTypeNameMethodPointer)});
}

uint8_t
il2cpp_method_is_external (void * method)
{
    uint32_t implementation_flags;

    il2cpp_method_get_flags (method, &implementation_flags);

    return (implementation_flags & METHOD_IMPL_ATTRIBUTE_INTERNAL_CALL) != 0;
}

uint8_t
il2cpp_method_is_synchronized (void * method)
{
    uint32_t implementation_flags;

    il2cpp_method_get_flags (method, &implementation_flags);

    return (implementation_flags & METHOD_IMPL_ATTRIBUTE_SYNCHRONIZED) != 0;
}

uintptr_t
il2cpp_memory_snapshot_get_classes (const Il2CppManagedMemorySnapshot * snapshot,
                                    Il2CppMetadataType ** iter)
{
    const int zero;
    const void * null;

    if (iter != NULL && snapshot->metadata_snapshot.type_count > zero)
    {
        if (*iter == null)
        {
            *iter = snapshot->metadata_snapshot.types;
            return (uintptr_t) (*iter)->type_info_address;
        }
        else
        {
            Il2CppMetadataType * metadata_type = *iter + 1;

            if (metadata_type < snapshot->metadata_snapshot.types + snapshot->metadata_snapshot.type_count)
            {
                *iter = metadata_type;
                return (uintptr_t) (*iter)->type_info_address;
            }
        }
    }
    return 0;
}

struct Il2CppGCHandles
il2cpp_memory_snapshot_get_gc_handles (const Il2CppManagedMemorySnapshot * snapshot)
{
    return snapshot->gc_handles;
}

struct Il2CppRuntimeInformation
il2cpp_memory_snapshot_get_information (const Il2CppManagedMemorySnapshot * snapshot)
{
    return snapshot->runtime_information;
}
        `;
        offsetsFinderCModule.dispose();
        return new CModule(source);
    }
    /** @internal */
    static r(exportName, retType, argTypes) {
        const exportPointer = Il2Cpp.module.findExportByName(exportName) ?? this.cModule[exportName];
        if (exportPointer == null) {
            (0, console_1.raise)(`cannot resolve export ${exportName}`);
        }
        return new NativeFunction(exportPointer, retType, argTypes);
    }
}
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_alloc", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_arrayGetElements", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_arrayGetLength", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_arrayNew", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_assemblyGetImage", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classForEach", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classFromName", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classFromSystemType", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classFromType", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classGetActualInstanceSize", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classGetArrayClass", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classGetArrayElementSize", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classGetAssemblyName", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classGetBaseType", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classGetDeclaringType", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classGetElementClass", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classGetFieldFromName", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classGetFields", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classGetFlags", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classGetImage", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classGetInstanceSize", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classGetInterfaces", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classGetMethodFromName", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classGetMethods", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classGetName", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classGetNamespace", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classGetNestedClasses", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classGetParent", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classGetRank", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classGetStaticFieldData", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classGetValueSize", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classGetType", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classHasReferences", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classInit", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classIsAbstract", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classIsAssignableFrom", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classIsBlittable", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classIsEnum", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classIsGeneric", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classIsInflated", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classIsInterface", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classIsSubclassOf", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_classIsValueType", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_domainAssemblyOpen", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_domainGet", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_domainGetAssemblies", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_fieldGetModifier", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_fieldGetClass", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_fieldGetFlags", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_fieldGetName", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_fieldGetOffset", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_fieldGetStaticValue", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_fieldGetType", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_fieldIsLiteral", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_fieldIsStatic", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_fieldIsThreadStatic", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_fieldSetStaticValue", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_free", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_gcCollect", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_gcCollectALittle", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_gcDisable", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_gcEnable", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_gcGetHeapSize", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_gcGetMaxTimeSlice", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_gcGetUsedSize", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_gcHandleGetTarget", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_gcHandleFree", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_gcHandleNew", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_gcHandleNewWeakRef", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_gcIsDisabled", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_gcIsIncremental", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_gcSetMaxTimeSlice", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_gcStartIncrementalCollection", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_gcStartWorld", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_gcStopWorld", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_getCorlib", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_imageGetAssembly", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_imageGetClass", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_imageGetClassCount", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_imageGetName", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_init", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_livenessAllocateStruct", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_livenessCalculationBegin", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_livenessCalculationEnd", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_livenessCalculationFromStatics", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_livenessFinalize", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_livenessFreeStruct", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_memorySnapshotCapture", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_memorySnapshotFree", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_memorySnapshotGetClasses", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_memorySnapshotGetGCHandles", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_memorySnapshotGetRuntimeInformation", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_methodGetModifier", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_methodGetClass", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_methodGetFlags", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_methodGetFromReflection", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_methodGetName", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_methodGetObject", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_methodGetParameterCount", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_methodGetParameterName", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_methodGetParameters", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_methodGetParameterType", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_methodGetPointer", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_methodGetReturnType", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_methodIsExternal", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_methodIsGeneric", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_methodIsInflated", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_methodIsInstance", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_methodIsSynchronized", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_monitorEnter", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_monitorExit", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_monitorPulse", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_monitorPulseAll", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_monitorTryEnter", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_monitorTryWait", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_monitorWait", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_objectGetClass", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_objectGetVirtualMethod", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_objectInit", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_objectNew", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_objectGetSize", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_objectUnbox", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_resolveInternalCall", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_stringChars", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_stringLength", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_stringNew", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_stringSetLength", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_valueBox", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_threadAttach", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_threadCurrent", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_threadGetAllAttachedThreads", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_threadIsVm", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_threadDetach", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_typeGetName", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_typeGetObject", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_typeGetTypeEnum", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_typeIsByReference", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "_typeIsPrimitive", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppApi, "cModule", null);
Il2Cpp.Api = Il2CppApi;

},{"../utils/console":168,"decorator-cache-getter":139,"versioning":174}],142:[function(require,module,exports){
(function (setImmediate){(function (){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_cache_getter_1 = require("decorator-cache-getter");
const versioning_1 = __importDefault(require("versioning"));
const console_1 = require("../utils/console");
const native_wait_1 = require("../utils/native-wait");
/** */
class Il2CppBase {
    constructor() { }
    /** @internal Gets the Il2Cpp module name. */
    static get moduleName() {
        switch (Process.platform) {
            case "linux":
                try {
                    const _ = Java.androidVersion;
                    return "libil2cpp.so";
                }
                catch (e) {
                    return "GameAssembly.so";
                }
            case "windows":
                return "GameAssembly.dll";
            case "darwin":
                try {
                    return "UnityFramework";
                }
                catch (e) {
                    return "GameAssembly.dylib";
                }
        }
        (0, console_1.raise)(`${Process.platform} is not supported yet`);
    }
    /** */
    static get applicationDataPath() {
        const get_persistentDataPath = this.internalCall("UnityEngine.Application::get_persistentDataPath", "pointer", []);
        return new Il2Cpp.String(get_persistentDataPath()).content;
    }
    /** */
    static get applicationIdentifier() {
        const get_identifier = this.internalCall("UnityEngine.Application::get_identifier", "pointer", []) ??
            this.internalCall("UnityEngine.Application::get_bundleIdentifier", "pointer", []);
        return get_identifier ? new Il2Cpp.String(get_identifier()).content : null;
    }
    /** Gets the version of the application */
    static get applicationVersion() {
        const get_version = this.internalCall("UnityEngine.Application::get_version", "pointer", []);
        return get_version ? new Il2Cpp.String(get_version()).content : null;
    }
    /** Gets the attached threads. */
    static get attachedThreads() {
        if (Il2Cpp.currentThread == null) {
            (0, console_1.raise)("only Il2Cpp threads can invoke Il2Cpp.attachedThreads");
        }
        const array = [];
        const sizePointer = Memory.alloc(Process.pointerSize);
        const startPointer = Il2Cpp.Api._threadGetAllAttachedThreads(sizePointer);
        const size = sizePointer.readInt();
        for (let i = 0; i < size; i++) {
            array.push(new Il2Cpp.Thread(startPointer.add(i * Process.pointerSize).readPointer()));
        }
        return array;
    }
    /** Gets the current attached thread, if any. */
    static get currentThread() {
        const handle = Il2Cpp.Api._threadCurrent();
        return handle.isNull() ? null : new Il2Cpp.Thread(handle);
    }
    /** Gets the Il2Cpp module as a Frida module. */
    static get module() {
        return Process.getModuleByName(this.moduleName);
    }
    /** Gets the Unity version of the current application. */
    static get unityVersion() {
        const get_unityVersion = this.internalCall("UnityEngine.Application::get_unityVersion", "pointer", []);
        if (get_unityVersion == null) {
            (0, console_1.raise)("couldn't determine the Unity version, please specify it manually");
        }
        return new Il2Cpp.String(get_unityVersion()).content;
    }
    /** @internal */
    static get unityVersionIsBelow201830() {
        return versioning_1.default.lt(this.unityVersion, "2018.3.0");
    }
    /** Allocates the given amount of bytes. */
    static alloc(size = Process.pointerSize) {
        return Il2Cpp.Api._alloc(size);
    }
    /** Dumps the application. */
    static dump(fileName, path) {
        fileName = fileName ?? `${Il2Cpp.applicationIdentifier ?? "unknown"}_${Il2Cpp.applicationVersion ?? "unknown"}.cs`;
        const destination = `${path ?? Il2Cpp.applicationDataPath}/${fileName}`;
        const file = new File(destination, "w");
        for (const assembly of Il2Cpp.Domain.assemblies) {
            (0, console_1.inform)(`dumping ${assembly.name}...`);
            for (const klass of assembly.image.classes) {
                file.write(`${klass}\n\n`);
            }
        }
        file.flush();
        file.close();
        (0, console_1.ok)(`dump saved to ${destination}`);
    }
    /** Frees memory. */
    static free(pointer) {
        return Il2Cpp.Api._free(pointer);
    }
    /** @internal Waits for Unity and Il2Cpp native libraries to be loaded and initialized. */
    static async initialize() {
        if (Process.platform == "darwin") {
            let il2cppModuleName = Process.findModuleByAddress(Module.findExportByName(null, "il2cpp_init") ?? NULL)?.name;
            if (il2cppModuleName == undefined) {
                il2cppModuleName = await (0, native_wait_1.forModule)("UnityFramework", "GameAssembly.dylib");
            }
            Reflect.defineProperty(Il2Cpp, "moduleName", { value: il2cppModuleName });
        }
        else {
            await (0, native_wait_1.forModule)(this.moduleName);
        }
        if (Il2Cpp.Api._getCorlib().isNull()) {
            await new Promise(resolve => {
                const interceptor = Interceptor.attach(Il2Cpp.Api._init, {
                    onLeave() {
                        interceptor.detach();
                        setImmediate(resolve);
                    }
                });
            });
        }
    }
    /** */
    static installExceptionListener(targetThread = "current") {
        const threadId = Process.getCurrentThreadId();
        return Interceptor.attach(Il2Cpp.module.getExportByName("__cxa_throw"), function (args) {
            if (targetThread == "current" && this.threadId != threadId) {
                return;
            }
            (0, console_1.inform)(new Il2Cpp.Object(args[0].readPointer()));
        });
    }
    /** */
    static internalCall(name, retType, argTypes) {
        const handle = Il2Cpp.Api._resolveInternalCall(Memory.allocUtf8String(name));
        return handle.isNull() ? null : new NativeFunction(handle, retType, argTypes);
    }
    /** Schedules a callback on the Il2Cpp initializer thread. */
    static scheduleOnInitializerThread(block) {
        return new Promise(resolve => {
            const listener = Interceptor.attach(Il2Cpp.Api._threadCurrent, () => {
                const currentThreadId = Il2Cpp.currentThread?.id;
                if (currentThreadId != undefined && currentThreadId == Il2Cpp.attachedThreads[0].id) {
                    listener.detach();
                    const result = block();
                    setImmediate(() => resolve(result));
                }
            });
        });
    }
    /** Attaches the caller thread to Il2Cpp domain and executes the given block.  */
    static async perform(block) {
        await this.initialize();
        let thread = this.currentThread;
        const isForeignThread = thread == null;
        if (thread == null) {
            thread = Il2Cpp.Domain.attach();
        }
        try {
            const result = block();
            return result instanceof Promise ? await result : result;
        }
        catch (e) {
            globalThis.console.log(e);
            throw e;
        }
        finally {
            if (isForeignThread) {
                thread.detach();
            }
        }
    }
    /** Creates a new `Il2Cpp.Tracer` instance. */
    static trace() {
        return new Il2Cpp.Tracer();
    }
}
__decorate([
    decorator_cache_getter_1.cache
], Il2CppBase, "applicationDataPath", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppBase, "applicationIdentifier", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppBase, "applicationVersion", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppBase, "module", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppBase, "unityVersion", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppBase, "unityVersionIsBelow201830", null);
Reflect.set(globalThis, "Il2Cpp", Il2CppBase);

}).call(this)}).call(this,require("timers").setImmediate)

},{"../utils/console":168,"../utils/native-wait":170,"decorator-cache-getter":139,"timers":173,"versioning":174}],143:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Filtering utilities. */
class Il2CppFiltering {
    constructor() { }
    /** Creates a filter which includes `element`s whose type can be assigned to `klass` variables. */
    static Is(klass) {
        return (element) => {
            if (element instanceof Il2Cpp.Class) {
                return klass.isAssignableFrom(element);
            }
            else {
                return klass.isAssignableFrom(element.class);
            }
        };
    }
    /** Creates a filter which includes `element`s whose type corresponds to `klass` type. */
    static IsExactly(klass) {
        return (element) => {
            if (element instanceof Il2Cpp.Class) {
                return element.equals(klass);
            }
            else {
                return element.class.equals(klass);
            }
        };
    }
}
Il2Cpp.Filtering = Il2CppFiltering;

},{}],144:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./base");
require("./api");
require("./filtering");
require("./runtime");
require("./tracer");
require("./structs/array");
require("./structs/assembly");
require("./structs/class");
require("./structs/domain");
require("./structs/field");
require("./structs/gc");
require("./structs/gc-handle");
require("./structs/image");
require("./structs/memory-snapshot");
require("./structs/method");
require("./structs/object");
require("./structs/parameter");
require("./structs/pointer");
require("./structs/reference");
require("./structs/string");
require("./structs/thread");
require("./structs/type");
require("./structs/type-enum");
require("./structs/value-type");

},{"./api":141,"./base":142,"./filtering":143,"./runtime":145,"./structs/array":146,"./structs/assembly":147,"./structs/class":148,"./structs/domain":149,"./structs/field":150,"./structs/gc":152,"./structs/gc-handle":151,"./structs/image":153,"./structs/memory-snapshot":154,"./structs/method":155,"./structs/object":156,"./structs/parameter":157,"./structs/pointer":158,"./structs/reference":159,"./structs/string":160,"./structs/thread":161,"./structs/type":163,"./structs/type-enum":162,"./structs/value-type":164,"./tracer":165}],145:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_cache_getter_1 = require("decorator-cache-getter");
/** */
class Il2CppRuntime {
    constructor() { }
    /** Gets the allocation granularity. */
    static get allocationGranularity() {
        return this.information[5];
    }
    /** Gets the size of the Il2CppArray struct. */
    static get arrayHeaderSize() {
        return this.information[2];
    }
    /** @internal */
    static get information() {
        const snapshot = Il2Cpp.MemorySnapshot.capture();
        try {
            return Il2Cpp.Api._memorySnapshotGetRuntimeInformation(snapshot);
        }
        finally {
            Il2Cpp.Api._memorySnapshotFree(snapshot);
        }
    }
    /** Gets the pointer size. */
    static get pointerSize() {
        return this.information[0];
    }
    /** Gets the size of the Il2CppObject struct. */
    static get objectHeaderSize() {
        return this.information[1];
    }
}
__decorate([
    decorator_cache_getter_1.cache
], Il2CppRuntime, "information", null);
Il2Cpp.Runtime = Il2CppRuntime;

},{"decorator-cache-getter":139}],146:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_cache_getter_1 = require("decorator-cache-getter");
const console_1 = require("../../utils/console");
const native_struct_1 = require("../../utils/native-struct");
/** Represents a `Il2CppArraySize`. */
class Il2CppArray extends native_struct_1.NativeStruct {
    /** @internal */
    static from(klass, lengthOrElements) {
        const length = typeof lengthOrElements == "number" ? lengthOrElements : lengthOrElements.length;
        const array = new Il2Cpp.Array(Il2Cpp.Api._arrayNew(klass, length));
        if (Array.isArray(lengthOrElements)) {
            array.elements.write(lengthOrElements);
        }
        return array;
    }
    /** @internal Gets a pointer to the first element of the current array. */
    get elements() {
        return new Il2Cpp.Pointer(Il2Cpp.Api._arrayGetElements(this), this.elementType);
    }
    /** Gets the size of the object encompassed by the current array. */
    get elementSize() {
        return this.elementType.class.arrayElementSize;
    }
    /** Gets the type of the object encompassed by the current array. */
    get elementType() {
        return this.object.class.type.class.baseType;
    }
    /** Gets the total number of elements in all the dimensions of the current array. */
    get length() {
        return Il2Cpp.Api._arrayGetLength(this);
    }
    /** Gets the encompassing object of the current array. */
    get object() {
        return new Il2Cpp.Object(this);
    }
    /** Gets the element at the specified index of the current array. */
    get(index) {
        if (index < 0 || index >= this.length) {
            (0, console_1.raise)(`cannot get element at index ${index}: array length is ${this.length}`);
        }
        return this.elements.get(index);
    }
    /** Sets the element at the specified index of the current array. */
    set(index, value) {
        if (index < 0 || index >= this.length) {
            (0, console_1.raise)(`cannot get element at index ${index}: array length is ${this.length}`);
        }
        this.elements.set(index, value);
    }
    /** */
    toString() {
        return this.isNull() ? "null" : `[${this.elements.read(this.length, 0)}]`;
    }
    /** Iterable. */
    *[Symbol.iterator]() {
        for (let i = 0; i < this.length; i++) {
            yield this.elements.get(i);
        }
    }
}
__decorate([
    decorator_cache_getter_1.cache
], Il2CppArray.prototype, "elements", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppArray.prototype, "elementSize", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppArray.prototype, "elementType", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppArray.prototype, "length", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppArray.prototype, "object", null);
Il2Cpp.Array = Il2CppArray;

},{"../../utils/console":168,"../../utils/native-struct":169,"decorator-cache-getter":139}],147:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_cache_getter_1 = require("decorator-cache-getter");
const native_struct_1 = require("../../utils/native-struct");
const utils_1 = require("../../utils/utils");
/** Represents a `Il2CppAssembly`. */
let Il2CppAssembly = class Il2CppAssembly extends native_struct_1.NonNullNativeStruct {
    /** Gets the image of this assembly. */
    get image() {
        return new Il2Cpp.Image(Il2Cpp.Api._assemblyGetImage(this));
    }
    /** Gets the name of this assembly. */
    get name() {
        return this.image.name.replace(".dll", "");
    }
    /** Gets the encompassing object of the current assembly. */
    get object() {
        return Il2Cpp.Image.corlib.class("System.Reflection.Assembly").method("Load").invoke(Il2Cpp.String.from(this.name));
    }
};
__decorate([
    decorator_cache_getter_1.cache
], Il2CppAssembly.prototype, "image", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppAssembly.prototype, "name", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppAssembly.prototype, "object", null);
Il2CppAssembly = __decorate([
    utils_1.cacheInstances
], Il2CppAssembly);
Il2Cpp.Assembly = Il2CppAssembly;

},{"../../utils/native-struct":169,"../../utils/utils":171,"decorator-cache-getter":139}],148:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_cache_getter_1 = require("decorator-cache-getter");
const console_1 = require("../../utils/console");
const native_struct_1 = require("../../utils/native-struct");
const utils_1 = require("../../utils/utils");
/** Represents a `Il2CppClass`. */
let Il2CppClass = class Il2CppClass extends native_struct_1.NonNullNativeStruct {
    /** Gets the actual size of the instance of the current class. */
    get actualInstanceSize() {
        return Il2Cpp.Api._classGetActualInstanceSize(this);
    }
    /** Gets the array class which encompass the current class. */
    get arrayClass() {
        return new Il2Cpp.Class(Il2Cpp.Api._classGetArrayClass(this, 1));
    }
    /** Gets the size of the object encompassed by the current array class. */
    get arrayElementSize() {
        return Il2Cpp.Api._classGetArrayElementSize(this);
    }
    /** Gets the name of the assembly in which the current class is defined. */
    get assemblyName() {
        return Il2Cpp.Api._classGetAssemblyName(this).readUtf8String();
    }
    /** Gets the class that declares the current nested class. */
    get declaringClass() {
        const handle = Il2Cpp.Api._classGetDeclaringType(this);
        return handle.isNull() ? null : new Il2Cpp.Class(handle);
    }
    /** Gets the encompassed type of this array, reference, pointer or enum type. */
    get baseType() {
        const handle = Il2Cpp.Api._classGetBaseType(this);
        return handle.isNull() ? null : new Il2Cpp.Type(handle);
    }
    /** Gets the class of the object encompassed or referred to by the current array, pointer or reference class. */
    get elementClass() {
        const handle = Il2Cpp.Api._classGetElementClass(this);
        return handle.isNull() ? null : new Il2Cpp.Class(handle);
    }
    /** Gets the fields of the current class. */
    get fields() {
        return Array.from((0, utils_1.nativeIterator)(this, Il2Cpp.Api._classGetFields, Il2Cpp.Field));
    }
    /** Gets the flags of the current class. */
    get flags() {
        return Il2Cpp.Api._classGetFlags(this);
    }
    /** Gets the amount of generic parameters of this generic class. */
    get genericParameterCount() {
        if (!this.isGeneric) {
            return 0;
        }
        return this.type.object.method("GetGenericArguments").invoke().length;
    }
    /** Determines whether the GC has tracking references to the current class instances. */
    get hasReferences() {
        return !!Il2Cpp.Api._classHasReferences(this);
    }
    /** Determines whether ther current class has a valid static constructor. */
    get hasStaticConstructor() {
        const staticConstructor = this.tryMethod(".cctor");
        return staticConstructor != null && !staticConstructor.virtualAddress.isNull();
    }
    /** Gets the image in which the current class is defined. */
    get image() {
        return new Il2Cpp.Image(Il2Cpp.Api._classGetImage(this));
    }
    /** Gets the size of the instance of the current class. */
    get instanceSize() {
        return Il2Cpp.Api._classGetInstanceSize(this);
    }
    /** Determines whether the current class is abstract. */
    get isAbstract() {
        return !!Il2Cpp.Api._classIsAbstract(this);
    }
    /** Determines whether the current class is blittable. */
    get isBlittable() {
        return !!Il2Cpp.Api._classIsBlittable(this);
    }
    /** Determines whether the current class is an enumeration. */
    get isEnum() {
        return !!Il2Cpp.Api._classIsEnum(this);
    }
    /** Determines whether the current class is a generic one. */
    get isGeneric() {
        return !!Il2Cpp.Api._classIsGeneric(this);
    }
    /** Determines whether the current class is inflated. */
    get isInflated() {
        return !!Il2Cpp.Api._classIsInflated(this);
    }
    /** Determines whether the current class is an interface. */
    get isInterface() {
        return !!Il2Cpp.Api._classIsInterface(this);
    }
    /** Determines whether the current class is a value type. */
    get isValueType() {
        return !!Il2Cpp.Api._classIsValueType(this);
    }
    /** Gets the interfaces implemented or inherited by the current class. */
    get interfaces() {
        return Array.from((0, utils_1.nativeIterator)(this, Il2Cpp.Api._classGetInterfaces, Il2Cpp.Class));
    }
    /** Gets the methods implemented by the current class. */
    get methods() {
        return Array.from((0, utils_1.nativeIterator)(this, Il2Cpp.Api._classGetMethods, Il2Cpp.Method));
    }
    /** Gets the name of the current class. */
    get name() {
        return Il2Cpp.Api._classGetName(this).readUtf8String();
    }
    /** Gets the namespace of the current class. */
    get namespace() {
        return Il2Cpp.Api._classGetNamespace(this).readUtf8String();
    }
    /** Gets the classes nested inside the current class. */
    get nestedClasses() {
        return Array.from((0, utils_1.nativeIterator)(this, Il2Cpp.Api._classGetNestedClasses, Il2Cpp.Class));
    }
    /** Gets the class from which the current class directly inherits. */
    get parent() {
        const handle = Il2Cpp.Api._classGetParent(this);
        return handle.isNull() ? null : new Il2Cpp.Class(handle);
    }
    /** Gets the rank (number of dimensions) of the current array class. */
    get rank() {
        return Il2Cpp.Api._classGetRank(this);
    }
    /** Gets a pointer to the static fields of the current class. */
    get staticFieldsData() {
        return Il2Cpp.Api._classGetStaticFieldData(this);
    }
    /** Gets the size of the instance - as a value type - of the current class. */
    get valueSize() {
        return Il2Cpp.Api._classGetValueSize(this, NULL);
    }
    /** Gets the type of the current class. */
    get type() {
        return new Il2Cpp.Type(Il2Cpp.Api._classGetType(this));
    }
    /** Allocates a new object of the current class. */
    alloc() {
        return new Il2Cpp.Object(Il2Cpp.Api._objectNew(this));
    }
    /** Gets the field identified by the given name. */
    field(name) {
        return this.tryField(name);
    }
    /** Builds a generic instance of the current generic class. */
    inflate(...classes) {
        if (!this.isGeneric) {
            (0, console_1.raise)(`cannot inflate class ${this.type.name}: it has no generic parameters`);
        }
        if (this.genericParameterCount != classes.length) {
            (0, console_1.raise)(`cannot inflate class ${this.type.name}: it needs ${this.genericParameterCount} generic parameter(s), not ${classes.length}`);
        }
        const types = classes.map(klass => klass.type.object);
        const typeArray = Il2Cpp.Array.from(Il2Cpp.Image.corlib.class("System.Type"), types);
        const inflatedType = this.type.object.method("MakeGenericType", 1).invoke(typeArray);
        return new Il2Cpp.Class(Il2Cpp.Api._classFromSystemType(inflatedType));
    }
    /** Calls the static constructor of the current class. */
    initialize() {
        Il2Cpp.Api._classInit(this);
    }
    /** Determines whether an instance of `other` class can be assigned to a variable of the current type. */
    isAssignableFrom(other) {
        return !!Il2Cpp.Api._classIsAssignableFrom(this, other);
    }
    /** Determines whether the current class derives from `other` class. */
    isSubclassOf(other, checkInterfaces) {
        return !!Il2Cpp.Api._classIsSubclassOf(this, other, +checkInterfaces);
    }
    /** Gets the method identified by the given name and parameter count. */
    method(name, parameterCount = -1) {
        return this.tryMethod(name, parameterCount);
    }
    /** Gets the nested class with the given name. */
    nested(name) {
        return this.tryNested(name);
    }
    /** Allocates a new object of the current class and calls its default constructor. */
    new() {
        const object = this.alloc();
        const exceptionArray = Memory.alloc(Process.pointerSize);
        Il2Cpp.Api._objectInit(object, exceptionArray);
        const exception = exceptionArray.readPointer();
        if (!exception.isNull()) {
            (0, console_1.raise)(new Il2Cpp.Object(exception).toString());
        }
        return object;
    }
    /** Gets the field with the given name. */
    tryField(name) {
        const handle = Il2Cpp.Api._classGetFieldFromName(this, Memory.allocUtf8String(name));
        return handle.isNull() ? null : new Il2Cpp.Field(handle);
    }
    /** Gets the method with the given name and parameter count. */
    tryMethod(name, parameterCount = -1) {
        const handle = Il2Cpp.Api._classGetMethodFromName(this, Memory.allocUtf8String(name), parameterCount);
        return handle.isNull() ? null : new Il2Cpp.Method(handle);
    }
    /** Gets the nested class with the given name. */
    tryNested(name) {
        return this.nestedClasses.find(e => e.name == name);
    }
    /** */
    toString() {
        const inherited = [this.parent].concat(this.interfaces);
        return `\
// ${this.assemblyName}
${this.isEnum ? `enum` : this.isValueType ? `struct` : this.isInterface ? `interface` : `class`} \
${this.type.name}\
${inherited ? ` : ${inherited.map(e => e?.type.name).join(`, `)}` : ``}
{
    ${this.fields.join(`\n    `)}
    ${this.methods.join(`\n    `)}
}`;
    }
    /** Executes a callback for every defined class. */
    static enumerate(block) {
        const callback = new NativeCallback(function (klass, _) {
            block(new Il2Cpp.Class(klass));
        }, "void", ["pointer", "pointer"]);
        return Il2Cpp.Api._classForEach(callback, NULL);
    }
};
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "actualInstanceSize", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "arrayClass", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "arrayElementSize", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "assemblyName", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "declaringClass", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "baseType", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "elementClass", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "fields", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "flags", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "genericParameterCount", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "hasReferences", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "hasStaticConstructor", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "image", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "instanceSize", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "isAbstract", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "isBlittable", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "isEnum", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "isGeneric", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "isInflated", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "isInterface", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "isValueType", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "interfaces", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "methods", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "name", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "namespace", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "nestedClasses", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "parent", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "rank", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "staticFieldsData", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "valueSize", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppClass.prototype, "type", null);
__decorate([
    (0, utils_1.levenshtein)("fields")
], Il2CppClass.prototype, "field", null);
__decorate([
    (0, utils_1.levenshtein)("methods")
], Il2CppClass.prototype, "method", null);
__decorate([
    (0, utils_1.levenshtein)("nestedClasses")
], Il2CppClass.prototype, "nested", null);
Il2CppClass = __decorate([
    utils_1.cacheInstances
], Il2CppClass);
Il2Cpp.Class = Il2CppClass;

},{"../../utils/console":168,"../../utils/native-struct":169,"../../utils/utils":171,"decorator-cache-getter":139}],149:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_cache_getter_1 = require("decorator-cache-getter");
const utils_1 = require("../../utils/utils");
/** Represents a `Il2CppDomain`. */
class Il2CppDomain {
    constructor() { }
    /** Gets the assemblies that have been loaded into the execution context of the application domain. */
    static get assemblies() {
        const sizePointer = Memory.alloc(Process.pointerSize);
        const startPointer = Il2Cpp.Api._domainGetAssemblies(this, sizePointer);
        const count = sizePointer.readInt();
        const array = new Array(count);
        for (let i = 0; i < count; i++) {
            array[i] = new Il2Cpp.Assembly(startPointer.add(i * Process.pointerSize).readPointer());
        }
        if (count == 0) {
            for (const assemblyObject of this.object.method("GetAssemblies").overload().invoke()) {
                const assemblyName = assemblyObject.method("GetSimpleName").invoke().content;
                if (assemblyName != null) {
                    array.push(this.assembly(assemblyName));
                }
            }
        }
        return array;
    }
    /** Gets the application domain handle. */
    static get handle() {
        return Il2Cpp.Api._domainGet();
    }
    /** Gets the encompassing object of the application domain. */
    static get object() {
        return Il2Cpp.Image.corlib.class("System.AppDomain").method("get_CurrentDomain").invoke();
    }
    /** Opens and loads the assembly with the given name. */
    static assembly(name) {
        return this.tryAssembly(name);
    }
    /** Attached a new thread to the application domain. */
    static attach() {
        return new Il2Cpp.Thread(Il2Cpp.Api._threadAttach(this));
    }
    /** Opens and loads the assembly with the given name. */
    static tryAssembly(name) {
        const handle = Il2Cpp.Api._domainAssemblyOpen(this, Memory.allocUtf8String(name));
        return handle.isNull() ? null : new Il2Cpp.Assembly(handle);
    }
}
__decorate([
    decorator_cache_getter_1.cache
], Il2CppDomain, "assemblies", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppDomain, "handle", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppDomain, "object", null);
__decorate([
    (0, utils_1.levenshtein)("assemblies")
], Il2CppDomain, "assembly", null);
Il2Cpp.Domain = Il2CppDomain;

},{"../../utils/utils":171,"decorator-cache-getter":139}],150:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_cache_getter_1 = require("decorator-cache-getter");
const console_1 = require("../../utils/console");
const native_struct_1 = require("../../utils/native-struct");
const utils_1 = require("../utils");
/** Represents a `FieldInfo`. */
class Il2CppField extends native_struct_1.NonNullNativeStruct {
    /** Gets the class in which this field is defined. */
    get class() {
        return new Il2Cpp.Class(Il2Cpp.Api._fieldGetClass(this));
    }
    /** Gets the flags of the current field. */
    get flags() {
        return Il2Cpp.Api._fieldGetFlags(this);
    }
    /** Determines whether this field value is known at compile time. */
    get isLiteral() {
        return !!Il2Cpp.Api._fieldIsLiteral(this);
    }
    /** Determines whether this field is static. */
    get isStatic() {
        return !!Il2Cpp.Api._fieldIsStatic(this);
    }
    /** Determines whether this field is thread static. */
    get isThreadStatic() {
        return !!Il2Cpp.Api._fieldIsThreadStatic(this);
    }
    /** Gets the access modifier of this field. */
    get modifier() {
        return Il2Cpp.Api._fieldGetModifier(this).readUtf8String();
    }
    /** Gets the name of this field. */
    get name() {
        return Il2Cpp.Api._fieldGetName(this).readUtf8String();
    }
    /** Gets the offset of this field, calculated as the difference with its owner virtual address. */
    get offset() {
        return Il2Cpp.Api._fieldGetOffset(this);
    }
    /** Gets the type of this field. */
    get type() {
        return new Il2Cpp.Type(Il2Cpp.Api._fieldGetType(this));
    }
    /** Gets the value of this field. */
    get value() {
        const handle = Memory.alloc(Process.pointerSize);
        Il2Cpp.Api._fieldGetStaticValue(this.handle, handle);
        return (0, utils_1.read)(handle, this.type);
    }
    /** Sets the value of this field. Thread static or literal values cannot be altered yet. */
    set value(value) {
        if (this.isThreadStatic || this.isLiteral) {
            (0, console_1.raise)(`cannot modify the value of field ${this.name}: is thread static or literal`);
        }
        const handle = Memory.alloc(Process.pointerSize);
        (0, utils_1.write)(handle, value, this.type);
        Il2Cpp.Api._fieldSetStaticValue(this.handle, handle);
    }
    /** */
    toString() {
        return `\
${this.isThreadStatic ? `[ThreadStatic] ` : ``}\
${this.isStatic ? `static ` : ``}\
${this.type.name} \
${this.name}\
${this.isLiteral ? ` = ${this.type.class.isEnum ? (0, utils_1.read)(this.value.handle, this.type.class.baseType) : this.value}` : ``};\
${this.isThreadStatic || this.isLiteral ? `` : ` // 0x${this.offset.toString(16)}`}`;
    }
    /** @internal */
    withHolder(instance) {
        let valueHandle = instance.handle.add(this.offset);
        if (instance instanceof Il2Cpp.ValueType) {
            valueHandle = valueHandle.sub(Il2Cpp.Runtime.objectHeaderSize);
        }
        return new Proxy(this, {
            get(target, property) {
                if (property == "value") {
                    return (0, utils_1.read)(valueHandle, target.type);
                }
                return Reflect.get(target, property);
            },
            set(target, property, value) {
                if (property == "value") {
                    (0, utils_1.write)(valueHandle, value, target.type);
                    return true;
                }
                return Reflect.set(target, property, value);
            }
        });
    }
}
__decorate([
    decorator_cache_getter_1.cache
], Il2CppField.prototype, "class", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppField.prototype, "flags", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppField.prototype, "isLiteral", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppField.prototype, "isStatic", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppField.prototype, "isThreadStatic", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppField.prototype, "name", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppField.prototype, "offset", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppField.prototype, "type", null);
Reflect.set(Il2Cpp, "Field", Il2CppField);

},{"../../utils/console":168,"../../utils/native-struct":169,"../utils":166,"decorator-cache-getter":139}],151:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Represents a GCHandle. */
class Il2CppGCHandle {
    handle;
    /** @internal */
    constructor(handle) {
        this.handle = handle;
    }
    /** Gets the object associated to this handle. */
    get target() {
        const handle = Il2Cpp.Api._gcHandleGetTarget(this.handle);
        return handle.isNull() ? null : new Il2Cpp.Object(handle);
    }
    /** Frees this handle. */
    free() {
        return Il2Cpp.Api._gcHandleFree(this.handle);
    }
}
Il2Cpp.GC.Handle = Il2CppGCHandle;

},{}],152:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const versioning_1 = __importDefault(require("versioning"));
/** Garbage collector utility functions. */
class Il2CppGC {
    constructor() { }
    /** Gets the heap size in bytes. */
    static get heapSize() {
        return Il2Cpp.Api._gcGetHeapSize();
    }
    /** Determines whether the garbage collector is disabled. */
    static get isEnabled() {
        return !Il2Cpp.Api._gcIsDisabled();
    }
    /** Determines whether the garbage collector is incremental. */
    static get isIncremental() {
        return !!Il2Cpp.Api._gcIsIncremental();
    }
    /** Gets the number of nanoseconds the garbage collector can spend in a collection step. */
    static get maxTimeSlice() {
        return Il2Cpp.Api._gcGetMaxTimeSlice();
    }
    /** Gets the used heap size in bytes. */
    static get usedHeapSize() {
        return Il2Cpp.Api._gcGetUsedSize();
    }
    /** Enables or disables the garbage collector. */
    static set isEnabled(value) {
        value ? Il2Cpp.Api._gcEnable() : Il2Cpp.Api._gcDisable();
    }
    /** Sets the number of nanoseconds the garbage collector can spend in a collection step. */
    static set maxTimeSlice(nanoseconds) {
        Il2Cpp.Api._gcSetMaxTimeSlice(nanoseconds);
    }
    /** Returns the heap allocated objects of the specified class. This variant reads GC descriptors. */
    static choose(klass) {
        const matches = [];
        const callback = (objects, size, _) => {
            for (let i = 0; i < size; i++) {
                matches.push(new Il2Cpp.Object(objects.add(i * Process.pointerSize).readPointer()));
            }
        };
        const chooseCallback = new NativeCallback(callback, "void", ["pointer", "int", "pointer"]);
        if (versioning_1.default.gte(Il2Cpp.unityVersion, "2021.2.0")) {
            const realloc = (handle, size) => {
                if (!handle.isNull() && size.compare(0) == 0) {
                    Il2Cpp.free(handle);
                    return NULL;
                }
                else {
                    return Il2Cpp.alloc(size);
                }
            };
            const reallocCallback = new NativeCallback(realloc, "pointer", ["pointer", "size_t", "pointer"]);
            const state = Il2Cpp.Api._livenessAllocateStruct(klass.handle, 0, chooseCallback, NULL, reallocCallback);
            Il2Cpp.Api._livenessCalculationFromStatics(state);
            Il2Cpp.Api._livenessFinalize(state);
            Il2Cpp.Api._livenessFreeStruct(state);
        }
        else {
            const onWorld = new NativeCallback(() => { }, "void", []);
            const state = Il2Cpp.Api._livenessCalculationBegin(klass.handle, 0, chooseCallback, NULL, onWorld, onWorld);
            Il2Cpp.Api._livenessCalculationFromStatics(state);
            Il2Cpp.Api._livenessCalculationEnd(state);
        }
        return matches;
    }
    /** Forces a garbage collection of the specified generation. */
    static collect(generation) {
        Il2Cpp.Api._gcCollect(generation < 0 ? 0 : generation > 2 ? 2 : generation);
    }
    /** Forces a garbage collection. */
    static collectALittle() {
        Il2Cpp.Api._gcCollectALittle();
    }
    /** Resumes all the previously stopped threads. */
    static startWorld() {
        return Il2Cpp.Api._gcStartWorld();
    }
    /** Performs an incremental garbage collection. */
    static startIncrementalCollection() {
        return Il2Cpp.Api._gcStartIncrementalCollection();
    }
    /** Stops all threads which may access the garbage collected heap, other than the caller. */
    static stopWorld() {
        return Il2Cpp.Api._gcStopWorld();
    }
}
Reflect.set(Il2Cpp, "GC", Il2CppGC);

},{"versioning":174}],153:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_cache_getter_1 = require("decorator-cache-getter");
const native_struct_1 = require("../../utils/native-struct");
const utils_1 = require("../../utils/utils");
/** Represents a `Il2CppImage`. */
let Il2CppImage = class Il2CppImage extends native_struct_1.NonNullNativeStruct {
    /** Gets the COR library. */
    static get corlib() {
        return new Il2Cpp.Image(Il2Cpp.Api._getCorlib());
    }
    /** Gets the assembly in which the current image is defined. */
    get assembly() {
        return new Il2Cpp.Assembly(Il2Cpp.Api._imageGetAssembly(this));
    }
    /** Gets the amount of classes defined in this image. */
    get classCount() {
        return Il2Cpp.Api._imageGetClassCount(this);
    }
    /** Gets the classes defined in this image. */
    get classes() {
        if (Il2Cpp.unityVersionIsBelow201830) {
            const types = this.assembly.object.method("GetTypes").invoke(false);
            // On Unity 5.3.8f1, getting System.Reflection.Emit.OpCodes type name
            // without iterating all the classes first somehow blows things up at
            // app startup, hence the `Array.from`.
            return Array.from(types).map(e => new Il2Cpp.Class(Il2Cpp.Api._classFromSystemType(e)));
        }
        else {
            return Array.from(Array(this.classCount), (_, i) => new Il2Cpp.Class(Il2Cpp.Api._imageGetClass(this, i)));
        }
    }
    /** Gets the name of this image. */
    get name() {
        return Il2Cpp.Api._imageGetName(this).readUtf8String();
    }
    /** Gets the class with the specified name defined in this image. */
    class(name) {
        return this.tryClass(name);
    }
    /** Gets the class with the specified name defined in this image. */
    tryClass(name) {
        const dotIndex = name.lastIndexOf(".");
        const classNamespace = Memory.allocUtf8String(dotIndex == -1 ? "" : name.slice(0, dotIndex));
        const className = Memory.allocUtf8String(name.slice(dotIndex + 1));
        const handle = Il2Cpp.Api._classFromName(this, classNamespace, className);
        return handle.isNull() ? null : new Il2Cpp.Class(handle);
    }
};
__decorate([
    decorator_cache_getter_1.cache
], Il2CppImage.prototype, "assembly", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppImage.prototype, "classCount", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppImage.prototype, "classes", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppImage.prototype, "name", null);
__decorate([
    (0, utils_1.levenshtein)("classes", e => (e.namespace ? `${e.namespace}.${e.name}` : e.name))
], Il2CppImage.prototype, "class", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppImage, "corlib", null);
Il2CppImage = __decorate([
    utils_1.cacheInstances
], Il2CppImage);
Il2Cpp.Image = Il2CppImage;

},{"../../utils/native-struct":169,"../../utils/utils":171,"decorator-cache-getter":139}],154:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_cache_getter_1 = require("decorator-cache-getter");
const native_struct_1 = require("../../utils/native-struct");
const utils_1 = require("../../utils/utils");
/** Represents a `Il2CppManagedMemorySnapshot`. */
class Il2CppMemorySnapshot extends native_struct_1.NonNullNativeStruct {
    /** Captures a memory snapshot. */
    static capture() {
        return new Il2Cpp.MemorySnapshot();
    }
    /** Creates a memory snapshot with the given handle. */
    constructor(handle = Il2Cpp.Api._memorySnapshotCapture()) {
        super(handle);
    }
    /** Gets any initialized class. */
    get classes() {
        return Array.from((0, utils_1.nativeIterator)(this, Il2Cpp.Api._memorySnapshotGetClasses, Il2Cpp.Class));
    }
    /** Gets the objects tracked by this memory snapshot. */
    get objects() {
        const array = [];
        const [count, start] = Il2Cpp.Api._memorySnapshotGetGCHandles(this);
        for (let i = 0; i < count; i++) {
            array.push(new Il2Cpp.Object(start.add(i * Process.pointerSize).readPointer()));
        }
        return array;
    }
    /** Frees this memory snapshot. */
    free() {
        Il2Cpp.Api._memorySnapshotFree(this);
    }
}
__decorate([
    decorator_cache_getter_1.cache
], Il2CppMemorySnapshot.prototype, "classes", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppMemorySnapshot.prototype, "objects", null);
Il2Cpp.MemorySnapshot = Il2CppMemorySnapshot;

},{"../../utils/native-struct":169,"../../utils/utils":171,"decorator-cache-getter":139}],155:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_cache_getter_1 = require("decorator-cache-getter");
const console_1 = require("../../utils/console");
const native_struct_1 = require("../../utils/native-struct");
const utils_1 = require("../../utils/utils");
const utils_2 = require("../utils");
/** Represents a `MethodInfo`. */
class Il2CppMethod extends native_struct_1.NonNullNativeStruct {
    /** Gets the class in which this method is defined. */
    get class() {
        return new Il2Cpp.Class(Il2Cpp.Api._methodGetClass(this));
    }
    /** Gets the flags of the current method. */
    get flags() {
        return Il2Cpp.Api._methodGetFlags(this, NULL);
    }
    /** Gets the implementation flags of the current method. */
    get implementationFlags() {
        const implementationFlagsPointer = Memory.alloc(Process.pointerSize);
        Il2Cpp.Api._methodGetFlags(this, implementationFlagsPointer);
        return implementationFlagsPointer.readU32();
    }
    /** */
    get fridaSignature() {
        const types = [];
        for (const parameter of this.parameters) {
            types.push(parameter.type.fridaAlias);
        }
        if (!this.isStatic || Il2Cpp.unityVersionIsBelow201830) {
            types.unshift("pointer");
        }
        if (this.isInflated) {
            types.push("pointer");
        }
        return types;
    }
    /** Gets the amount of generic parameters of this generic method. */
    get genericParameterCount() {
        if (!this.isGeneric) {
            return 0;
        }
        return this.object.method("GetGenericArguments").invoke().length;
    }
    /** Determines whether this method is external. */
    get isExternal() {
        return !!Il2Cpp.Api._methodIsExternal(this);
    }
    /** Determines whether this method is generic. */
    get isGeneric() {
        return !!Il2Cpp.Api._methodIsGeneric(this);
    }
    /** Determines whether this method is inflated (generic with a concrete type parameter). */
    get isInflated() {
        return !!Il2Cpp.Api._methodIsInflated(this);
    }
    /** Determines whether this method is static. */
    get isStatic() {
        return !Il2Cpp.Api._methodIsInstance(this);
    }
    /** Determines whether this method is synchronized. */
    get isSynchronized() {
        return !!Il2Cpp.Api._methodIsSynchronized(this);
    }
    /** Gets the access modifier of this method. */
    get modifier() {
        return Il2Cpp.Api._methodGetModifier(this).readUtf8String();
    }
    /** Gets the name of this method. */
    get name() {
        return Il2Cpp.Api._methodGetName(this).readUtf8String();
    }
    /** @internal */
    get nativeFunction() {
        return new NativeFunction(this.virtualAddress, this.returnType.fridaAlias, this.fridaSignature);
    }
    /** Gets the encompassing object of the current method. */
    get object() {
        return new Il2Cpp.Object(Il2Cpp.Api._methodGetObject(this, NULL));
    }
    /** Gets the amount of parameters of this method. */
    get parameterCount() {
        return Il2Cpp.Api._methodGetParameterCount(this);
    }
    /** Gets the parameters of this method. */
    get parameters() {
        return Array.from(Array(this.parameterCount), (_, i) => {
            const parameterName = Il2Cpp.Api._methodGetParameterName(this, i).readUtf8String();
            const parameterType = Il2Cpp.Api._methodGetParameterType(this, i);
            return new Il2Cpp.Parameter(parameterName, i, new Il2Cpp.Type(parameterType));
        });
    }
    /** Gets the relative virtual address (RVA) of this method. */
    get relativeVirtualAddress() {
        return this.virtualAddress.sub(Il2Cpp.module.base);
    }
    /** Gets the return type of this method. */
    get returnType() {
        return new Il2Cpp.Type(Il2Cpp.Api._methodGetReturnType(this));
    }
    /** Gets the virtual address (VA) to this method. */
    get virtualAddress() {
        return Il2Cpp.Api._methodGetPointer(this);
    }
    /** Replaces the body of this method. */
    set implementation(block) {
        const startIndex = +!this.isStatic | +Il2Cpp.unityVersionIsBelow201830;
        const callback = (...args) => {
            const parameters = this.parameters.map((e, i) => (0, utils_2.fromFridaValue)(args[i + startIndex], e.type));
            return (0, utils_2.toFridaValue)(block.call(this.isStatic ? this.class : new Il2Cpp.Object(args[0]), ...parameters));
        };
        try {
            Interceptor.replace(this.virtualAddress, new NativeCallback(callback, this.returnType.fridaAlias, this.fridaSignature));
        }
        catch (e) {
            switch (e.message) {
                case "access violation accessing 0x0":
                    (0, console_1.raise)(`cannot implement method ${this.name}: it has a NULL virtual address`);
                case `unable to intercept function at ${this.virtualAddress}; please file a bug`:
                    (0, console_1.warn)(`cannot implement method ${this.name}: it may be a thunk`);
                    break;
                case "already replaced this function":
                    (0, console_1.warn)(`cannot implement method ${this.name}: already replaced by a thunk`);
                    break;
                default:
                    throw e;
            }
        }
    }
    /** Creates a generic instance of the current generic method. */
    inflate(...classes) {
        if (!this.isGeneric) {
            (0, console_1.raise)(`cannot inflate method ${this.name}: it has no generic parameters`);
        }
        if (this.genericParameterCount != classes.length) {
            (0, console_1.raise)(`cannot inflate method ${this.name}: it needs ${this.genericParameterCount} generic parameter(s), not ${classes.length}`);
        }
        const types = classes.map(klass => klass.type.object);
        const typeArray = Il2Cpp.Array.from(Il2Cpp.Image.corlib.class("System.Type"), types);
        const inflatedMethodObject = this.object.method("MakeGenericMethod", 1).invoke(typeArray);
        return new Il2Cpp.Method(Il2Cpp.Api._methodGetFromReflection(inflatedMethodObject));
    }
    /** Invokes this method. */
    invoke(...parameters) {
        if (!this.isStatic) {
            (0, console_1.raise)(`cannot invoke a non-static method ${this.name}: must be invoked throught a Il2Cpp.Object, not a Il2Cpp.Class`);
        }
        return this.invokeRaw(NULL, ...parameters);
    }
    /** @internal */
    invokeRaw(instance, ...parameters) {
        const allocatedParameters = parameters.map(utils_2.toFridaValue);
        if (!this.isStatic || Il2Cpp.unityVersionIsBelow201830) {
            allocatedParameters.unshift(instance);
        }
        if (this.isInflated) {
            allocatedParameters.push(this.handle);
        }
        try {
            const returnValue = this.nativeFunction(...allocatedParameters);
            return (0, utils_2.fromFridaValue)(returnValue, this.returnType);
        }
        catch (e) {
            if (e == null) {
                (0, console_1.raise)("an unexpected native function exception occurred, this is due to parameter types mismatch");
            }
            switch (e.message) {
                case "bad argument count":
                    (0, console_1.raise)(`cannot invoke method ${this.name}: it needs ${this.parameterCount} parameter(s), not ${parameters.length}`);
                case "expected a pointer":
                case "expected number":
                case "expected array with fields":
                    (0, console_1.raise)(`cannot invoke method ${this.name}: parameter types mismatch`);
            }
            throw e;
        }
    }
    /** Gets the overloaded method with the given parameter types. */
    overload(...parameterTypes) {
        const result = this.tryOverload(...parameterTypes);
        if (result != undefined)
            return result;
        (0, console_1.raise)(`cannot find overloaded method ${this.name}(${parameterTypes})`);
    }
    /** Gets the parameter with the given name. */
    parameter(name) {
        return this.tryParameter(name);
    }
    /** Restore the original method implementation. */
    revert() {
        Interceptor.revert(this.virtualAddress);
        Interceptor.flush();
    }
    /** Gets the overloaded method with the given parameter types. */
    tryOverload(...parameterTypes) {
        return this.class.methods.find(e => e.name == this.name &&
            e.parameterCount == parameterTypes.length &&
            e.parameters.every((e, i) => e.type.name == parameterTypes[i]));
    }
    /** Gets the parameter with the given name. */
    tryParameter(name) {
        return this.parameters.find(e => e.name == name);
    }
    /** */
    toString() {
        return `\
${this.isStatic ? `static ` : ``}\
${this.returnType.name} \
${this.name}\
(${this.parameters.join(`, `)});\
${this.virtualAddress.isNull() ? `` : ` // 0x${this.relativeVirtualAddress.toString(16).padStart(8, `0`)}`}`;
    }
    /** @internal */
    withHolder(instance) {
        return new Proxy(this, {
            get(target, property) {
                switch (property) {
                    case "invoke":
                        return target.invokeRaw.bind(target, instance.handle);
                    case "inflate":
                    case "overload":
                    case "tryOverload":
                        return function (...args) {
                            return target[property](...args)?.withHolder(instance);
                        };
                }
                return Reflect.get(target, property);
            }
        });
    }
}
__decorate([
    decorator_cache_getter_1.cache
], Il2CppMethod.prototype, "class", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppMethod.prototype, "flags", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppMethod.prototype, "implementationFlags", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppMethod.prototype, "fridaSignature", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppMethod.prototype, "genericParameterCount", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppMethod.prototype, "isExternal", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppMethod.prototype, "isGeneric", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppMethod.prototype, "isInflated", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppMethod.prototype, "isStatic", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppMethod.prototype, "isSynchronized", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppMethod.prototype, "name", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppMethod.prototype, "nativeFunction", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppMethod.prototype, "object", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppMethod.prototype, "parameterCount", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppMethod.prototype, "parameters", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppMethod.prototype, "relativeVirtualAddress", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppMethod.prototype, "returnType", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppMethod.prototype, "virtualAddress", null);
__decorate([
    (0, utils_1.levenshtein)("parameters")
], Il2CppMethod.prototype, "parameter", null);
Reflect.set(Il2Cpp, "Method", Il2CppMethod);

},{"../../utils/console":168,"../../utils/native-struct":169,"../../utils/utils":171,"../utils":166,"decorator-cache-getter":139}],156:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_cache_getter_1 = require("decorator-cache-getter");
const native_struct_1 = require("../../utils/native-struct");
/** Represents a `Il2CppObject`. */
class Il2CppObject extends native_struct_1.NativeStruct {
    /** Gets the class of this object. */
    get class() {
        return new Il2Cpp.Class(Il2Cpp.Api._objectGetClass(this));
    }
    /** Gets the size of the current object. */
    get size() {
        return Il2Cpp.Api._objectGetSize(this);
    }
    /** Acquires an exclusive lock on the current object. */
    enter() {
        return Il2Cpp.Api._monitorEnter(this);
    }
    /** Release an exclusive lock on the current object. */
    exit() {
        return Il2Cpp.Api._monitorExit(this);
    }
    /** Gets the field with the given name. */
    field(name) {
        return this.class.field(name).withHolder(this);
    }
    /** Gets the method with the given name. */
    method(name, parameterCount = -1) {
        return this.class.method(name, parameterCount).withHolder(this);
    }
    /** Notifies a thread in the waiting queue of a change in the locked object's state. */
    pulse() {
        return Il2Cpp.Api._monitorPulse(this);
    }
    /** Notifies all waiting threads of a change in the object's state. */
    pulseAll() {
        return Il2Cpp.Api._monitorPulseAll(this);
    }
    /** Creates a reference to this object. */
    ref(pin) {
        return new Il2Cpp.GC.Handle(Il2Cpp.Api._gcHandleNew(this, +pin));
    }
    /** Gets the correct virtual method from the given virtual method. */
    virtualMethod(method) {
        return new Il2Cpp.Method(Il2Cpp.Api._objectGetVirtualMethod(this, method)).withHolder(this);
    }
    /** Attempts to acquire an exclusive lock on the current object. */
    tryEnter(timeout) {
        return !!Il2Cpp.Api._monitorTryEnter(this, timeout);
    }
    /** Gets the field with the given name. */
    tryField(name) {
        return this.class.tryField(name)?.withHolder(this);
    }
    /** Gets the field with the given name. */
    tryMethod(name, parameterCount = -1) {
        return this.class.tryMethod(name, parameterCount)?.withHolder(this);
    }
    /** Releases the lock on an object and attempts to block the current thread until it reacquires the lock. */
    tryWait(timeout) {
        return !!Il2Cpp.Api._monitorTryWait(this, timeout);
    }
    /** */
    toString() {
        return this.isNull() ? "null" : this.method("ToString").invoke().content ?? "null";
    }
    /** Unboxes the value type out of this object. */
    unbox() {
        return new Il2Cpp.ValueType(Il2Cpp.Api._objectUnbox(this), this.class.type);
    }
    /** Releases the lock on an object and blocks the current thread until it reacquires the lock. */
    wait() {
        return Il2Cpp.Api._monitorWait(this);
    }
    /** Creates a weak reference to this object. */
    weakRef(trackResurrection) {
        return new Il2Cpp.GC.Handle(Il2Cpp.Api._gcHandleNewWeakRef(this, +trackResurrection));
    }
}
__decorate([
    decorator_cache_getter_1.cache
], Il2CppObject.prototype, "class", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppObject.prototype, "size", null);
Il2Cpp.Object = Il2CppObject;

},{"../../utils/native-struct":169,"decorator-cache-getter":139}],157:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Represents a `ParameterInfo`. */
class Il2CppParameter {
    /** Name of this parameter. */
    name;
    /** Position of this parameter. */
    position;
    /** Type of this parameter. */
    type;
    constructor(name, position, type) {
        this.name = name;
        this.position = position;
        this.type = type;
    }
    /** */
    toString() {
        return `${this.type.name} ${this.name}`;
    }
}
Il2Cpp.Parameter = Il2CppParameter;

},{}],158:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const native_struct_1 = require("../../utils/native-struct");
/** */
class Il2CppPointer extends native_struct_1.NativeStruct {
    type;
    constructor(handle, type) {
        super(handle);
        this.type = type;
    }
    /** Gets the element at the given index. */
    get(index) {
        return (0, utils_1.read)(this.handle.add(index * this.type.class.arrayElementSize), this.type);
    }
    /** Reads the given amount of elements starting at the given offset. */
    read(length, offset = 0) {
        const values = new Array(length);
        for (let i = 0; i < length; i++) {
            values[i] = this.get(i + offset);
        }
        return values;
    }
    /** Sets the given element at the given index */
    set(index, value) {
        (0, utils_1.write)(this.handle.add(index * this.type.class.arrayElementSize), value, this.type);
    }
    /** */
    toString() {
        return this.handle.toString();
    }
    /** Writes the given elements starting at the given index. */
    write(values, offset = 0) {
        for (let i = 0; i < values.length; i++) {
            this.set(i + offset, values[i]);
        }
    }
}
Il2Cpp.Pointer = Il2CppPointer;

},{"../../utils/native-struct":169,"../utils":166}],159:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const native_struct_1 = require("../../utils/native-struct");
const console_1 = require("../../utils/console");
/** Represent a parameter passed by reference. */
class Il2CppReference extends native_struct_1.NativeStruct {
    type;
    constructor(handle, type) {
        super(handle);
        this.type = type;
    }
    /** Gets the element referenced by the current reference. */
    get value() {
        return (0, utils_1.read)(this.handle, this.type);
    }
    /** Sets the element referenced by the current reference. */
    set value(value) {
        (0, utils_1.write)(this.handle, value, this.type);
    }
    /** */
    toString() {
        return this.isNull() ? "null" : `->${this.value}`;
    }
    /** Creates a reference to the specified value. */
    static to(value, type) {
        const handle = Memory.alloc(Process.pointerSize);
        switch (typeof value) {
            case "boolean":
                return new Il2Cpp.Reference(handle.writeS8(+value), Il2Cpp.Image.corlib.class("System.Boolean").type);
            case "number":
                switch (type?.typeEnum) {
                    case 5 /* U1 */:
                        return new Il2Cpp.Reference(handle.writeU8(value), type);
                    case 4 /* I1 */:
                        return new Il2Cpp.Reference(handle.writeS8(value), type);
                    case 3 /* Char */:
                    case 7 /* U2 */:
                        return new Il2Cpp.Reference(handle.writeU16(value), type);
                    case 6 /* I2 */:
                        return new Il2Cpp.Reference(handle.writeS16(value), type);
                    case 9 /* U4 */:
                        return new Il2Cpp.Reference(handle.writeU32(value), type);
                    case 8 /* I4 */:
                        return new Il2Cpp.Reference(handle.writeS32(value), type);
                    case 11 /* U8 */:
                        return new Il2Cpp.Reference(handle.writeU64(value), type);
                    case 10 /* I8 */:
                        return new Il2Cpp.Reference(handle.writeS64(value), type);
                    case 12 /* R4 */:
                        return new Il2Cpp.Reference(handle.writeFloat(value), type);
                    case 13 /* R8 */:
                        return new Il2Cpp.Reference(handle.writeDouble(value), type);
                }
            case "object":
                if (value instanceof Il2Cpp.ValueType || value instanceof Il2Cpp.Pointer) {
                    return new Il2Cpp.Reference(handle.writePointer(value), value.type);
                }
                else if (value instanceof Il2Cpp.Object) {
                    return new Il2Cpp.Reference(handle.writePointer(value), value.class.type);
                }
                else if (value instanceof Il2Cpp.String || value instanceof Il2Cpp.Array) {
                    return new Il2Cpp.Reference(handle.writePointer(value), value.object.class.type);
                }
                else if (value instanceof NativePointer) {
                    switch (type?.typeEnum) {
                        case 25 /* UnsignedNativeInteger */:
                        case 24 /* NativeInteger */:
                            return new Il2Cpp.Reference(handle.writePointer(value), type);
                    }
                }
                else if (value instanceof Int64) {
                    return new Il2Cpp.Reference(handle.writeS64(value), Il2Cpp.Image.corlib.class("System.Int64").type);
                }
                else if (value instanceof UInt64) {
                    return new Il2Cpp.Reference(handle.writeU64(value), Il2Cpp.Image.corlib.class("System.UInt64").type);
                }
            default:
                (0, console_1.raise)(`don't know how to create a reference to ${value} using type ${type?.name}`);
        }
    }
}
Il2Cpp.Reference = Il2CppReference;

},{"../../utils/console":168,"../../utils/native-struct":169,"../utils":166}],160:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_struct_1 = require("../../utils/native-struct");
/** Represents a `Il2CppString`. */
class Il2CppString extends native_struct_1.NativeStruct {
    /** Gets the content of this string. */
    get content() {
        return Il2Cpp.Api._stringChars(this).readUtf16String(this.length);
    }
    /** Sets the content of this string. */
    set content(value) {
        Il2Cpp.Api._stringChars(this).writeUtf16String(value ?? "");
        Il2Cpp.Api._stringSetLength(this, value?.length ?? 0);
    }
    /** Gets the length of this string. */
    get length() {
        return Il2Cpp.Api._stringLength(this);
    }
    /** Gets the encompassing object of the current string. */
    get object() {
        return new Il2Cpp.Object(this);
    }
    /** */
    toString() {
        return this.isNull() ? "null" : `"${this.content}"`;
    }
    /** Creates a new string with the specified content. */
    static from(content) {
        return new Il2Cpp.String(Il2Cpp.Api._stringNew(Memory.allocUtf8String(content || "")));
    }
}
Il2Cpp.String = Il2CppString;

},{"../../utils/native-struct":169}],161:[function(require,module,exports){
(function (setImmediate){(function (){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_cache_getter_1 = require("decorator-cache-getter");
const console_1 = require("../../utils/console");
const native_struct_1 = require("../../utils/native-struct");
/** Represents a `Il2CppThread`. */
class Il2CppThread extends native_struct_1.NativeStruct {
    /** @internal */
    static get idOffset() {
        const handle = ptr(Il2Cpp.currentThread.internal.field("thread_id").value.toString());
        const currentThreadId = Process.getCurrentThreadId();
        for (let i = 0; i < 1024; i++) {
            const candidate = handle.add(i).readS32();
            if (candidate == currentThreadId) {
                return i;
            }
        }
        (0, console_1.raise)(`couldn't determine the offset for a native thread id value`);
    }
    /** Gets the native id of the current thread. */
    get id() {
        return ptr(this.internal.field("thread_id").value.toString()).add(Il2Cpp.Thread.idOffset).readS32();
    }
    /** @internal Gets the encompassing internal object (System.Threding.InternalThreead) of the current thread. */
    get internal() {
        const internalThread = this.object.tryField("internal_thread")?.value;
        return internalThread ? internalThread : this.object;
    }
    /** Determines whether the current thread is the garbage collector finalizer one. */
    get isFinalizer() {
        return !Il2Cpp.Api._threadIsVm(this);
    }
    /** Gets the encompassing object of the current thread. */
    get object() {
        return new Il2Cpp.Object(this);
    }
    /** @internal */
    get staticData() {
        return this.internal.field("static_data").value;
    }
    /** @internal */
    get synchronizationContext() {
        const get_ExecutionContext = this.object.tryMethod("GetMutableExecutionContext") || this.object.method("get_ExecutionContext");
        let synchronizationContext = get_ExecutionContext.invoke().tryMethod("get_SynchronizationContext")?.invoke();
        if (synchronizationContext == null) {
            const SystemThreadingSynchronizationContext = Il2Cpp.Image.corlib.class("System.Threading.SynchronizationContext");
            for (let i = 0; i < 16; i++) {
                try {
                    const candidate = new Il2Cpp.Object(this.staticData
                        .add(Process.pointerSize * i)
                        .readPointer()
                        .readPointer());
                    if (candidate.class.isSubclassOf(SystemThreadingSynchronizationContext, false)) {
                        synchronizationContext = candidate;
                        break;
                    }
                }
                catch (e) { }
            }
        }
        if (synchronizationContext == null) {
            (0, console_1.raise)("couldn't retrieve the SynchronizationContext for this thread.");
        }
        return synchronizationContext;
    }
    /** Detaches the thread from the application domain. */
    detach() {
        return Il2Cpp.Api._threadDetach(this);
    }
    /** Schedules a callback on the current thread. */
    schedule(block, delayMs = 0) {
        const threadId = this.id;
        const GetDisplayName = Il2Cpp.Image.corlib.class("Mono.Runtime").method("GetDisplayName");
        const SendOrPostCallback = Il2Cpp.Image.corlib.class("System.Threading.SendOrPostCallback").alloc();
        SendOrPostCallback.method(".ctor").invoke(NULL, GetDisplayName.handle);
        const Post = this.synchronizationContext.method("Post");
        return new Promise(resolve => {
            const listener = Interceptor.attach(GetDisplayName.virtualAddress, function () {
                if (this.threadId == threadId) {
                    listener.detach();
                    const result = block();
                    setImmediate(() => resolve(result));
                }
            });
            setTimeout(() => Post.invoke(SendOrPostCallback, NULL), delayMs);
        });
    }
}
__decorate([
    decorator_cache_getter_1.cache
], Il2CppThread.prototype, "internal", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppThread.prototype, "object", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppThread.prototype, "staticData", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppThread.prototype, "synchronizationContext", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppThread, "idOffset", null);
Il2Cpp.Thread = Il2CppThread;

}).call(this)}).call(this,require("timers").setImmediate)

},{"../../utils/console":168,"../../utils/native-struct":169,"decorator-cache-getter":139,"timers":173}],162:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],163:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_cache_getter_1 = require("decorator-cache-getter");
const native_struct_1 = require("../../utils/native-struct");
/** Represents a `Il2CppType`. */
class Il2CppType extends native_struct_1.NonNullNativeStruct {
    /** Gets the class of this type. */
    get class() {
        return new Il2Cpp.Class(Il2Cpp.Api._classFromType(this));
    }
    /** */
    get fridaAlias() {
        if (this.isByReference) {
            return "pointer";
        }
        switch (this.typeEnum) {
            case 1 /* Void */:
                return "void";
            case 2 /* Boolean */:
                return "bool";
            case 3 /* Char */:
                return "uchar";
            case 4 /* I1 */:
                return "int8";
            case 5 /* U1 */:
                return "uint8";
            case 6 /* I2 */:
                return "int16";
            case 7 /* U2 */:
                return "uint16";
            case 8 /* I4 */:
                return "int32";
            case 9 /* U4 */:
                return "uint32";
            case 10 /* I8 */:
                return "int64";
            case 11 /* U8 */:
                return "uint64";
            case 12 /* R4 */:
                return "float";
            case 13 /* R8 */:
                return "double";
            case 17 /* ValueType */:
                return getValueTypeFields(this);
            case 24 /* NativeInteger */:
            case 25 /* UnsignedNativeInteger */:
            case 15 /* Pointer */:
            case 14 /* String */:
            case 29 /* SingleDimensionalZeroLowerBoundArray */:
            case 20 /* Array */:
                return "pointer";
            case 18 /* Class */:
            case 28 /* Object */:
            case 21 /* GenericInstance */:
                return this.class.isValueType ? getValueTypeFields(this) : "pointer";
            default:
                return "pointer";
        }
    }
    /** Determines whether this type is passed by reference. */
    get isByReference() {
        return !!Il2Cpp.Api._typeIsByReference(this);
    }
    /** Determines whether this type is primitive. */
    get isPrimitive() {
        return !!Il2Cpp.Api._typeIsPrimitive(this);
    }
    /** Gets the name of this type. */
    get name() {
        const handle = Il2Cpp.Api._typeGetName(this);
        try {
            return handle.readUtf8String();
        }
        finally {
            Il2Cpp.free(handle);
        }
    }
    /** Gets the encompassing object of the current type. */
    get object() {
        return new Il2Cpp.Object(Il2Cpp.Api._typeGetObject(this));
    }
    /** Gets the type enum of the current type. */
    get typeEnum() {
        return Il2Cpp.Api._typeGetTypeEnum(this);
    }
    /** */
    toString() {
        return this.name;
    }
}
__decorate([
    decorator_cache_getter_1.cache
], Il2CppType.prototype, "class", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppType.prototype, "fridaAlias", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppType.prototype, "isByReference", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppType.prototype, "isPrimitive", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppType.prototype, "name", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppType.prototype, "object", null);
__decorate([
    decorator_cache_getter_1.cache
], Il2CppType.prototype, "typeEnum", null);
function getValueTypeFields(type) {
    const instanceFields = type.class.fields.filter(f => !f.isStatic);
    return instanceFields.length == 0 ? ["char"] : instanceFields.map(f => f.type.fridaAlias);
}
Reflect.set(Il2Cpp, "Type", Il2CppType);

},{"../../utils/native-struct":169,"decorator-cache-getter":139}],164:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_struct_1 = require("../../utils/native-struct");
/** Value type class utility. */
class Il2CppValueType extends native_struct_1.NativeStruct {
    type;
    constructor(handle, type) {
        super(handle);
        this.type = type;
    }
    /** Boxes the current value type in a object. */
    box() {
        return new Il2Cpp.Object(Il2Cpp.Api._valueBox(this.type.class, this));
    }
    /** Gets the field with the given name. */
    field(name) {
        return this.type.class.field(name).withHolder(this);
    }
    /** */
    toString() {
        return this.isNull() ? "null" : this.box().toString();
    }
}
Il2Cpp.ValueType = Il2CppValueType;

},{"../../utils/native-struct":169}],165:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("../utils/console");
const utils_1 = require("./utils");
/** Tracing utilities. */
class Il2CppTracer {
    /** @internal */
    targets = [];
    /** @internal */
    #assemblies;
    /** @internal */
    #classes;
    /** @internal */
    #methods;
    /** @internal */
    #assemblyFilter;
    /** @internal */
    #classFilter;
    /** @internal */
    #methodFilter;
    /** @internal */
    #parameterFilter;
    domain() {
        return this;
    }
    assemblies(...assemblies) {
        this.#assemblies = assemblies;
        return this;
    }
    classes(...classes) {
        this.#classes = classes;
        return this;
    }
    methods(...methods) {
        this.#methods = methods;
        return this;
    }
    filterAssemblies(filter) {
        this.#assemblyFilter = filter;
        return this;
    }
    filterClasses(filter) {
        this.#classFilter = filter;
        return this;
    }
    filterMethods(filter) {
        this.#methodFilter = filter;
        return this;
    }
    filterParameters(filter) {
        this.#parameterFilter = filter;
        return this;
    }
    and() {
        const filterMethod = (method) => {
            if (this.#parameterFilter == undefined) {
                this.targets.push(method);
                return;
            }
            for (const parameter of method.parameters) {
                if (this.#parameterFilter(parameter)) {
                    this.targets.push(method);
                    break;
                }
            }
        };
        const filterMethods = (values) => {
            for (const method of values) {
                filterMethod(method);
            }
        };
        const filterClass = (klass) => {
            if (this.#methodFilter == undefined) {
                filterMethods(klass.methods);
                return;
            }
            for (const method of klass.methods) {
                if (this.#methodFilter(method)) {
                    filterMethod(method);
                }
            }
        };
        const filterClasses = (values) => {
            for (const klass of values) {
                filterClass(klass);
            }
        };
        const filterAssembly = (assembly) => {
            if (this.#classFilter == undefined) {
                filterClasses(assembly.image.classes);
                return;
            }
            for (const klass of assembly.image.classes) {
                if (this.#classFilter(klass)) {
                    filterClass(klass);
                }
            }
        };
        const filterAssemblies = (assemblies) => {
            for (const assembly of assemblies) {
                filterAssembly(assembly);
            }
        };
        const filterDomain = (domain) => {
            if (this.#assemblyFilter == undefined) {
                filterAssemblies(domain.assemblies);
                return;
            }
            for (const assembly of domain.assemblies) {
                if (this.#assemblyFilter(assembly)) {
                    filterAssembly(assembly);
                }
            }
        };
        this.#methods
            ? filterMethods(this.#methods)
            : this.#classes
                ? filterClasses(this.#classes)
                : this.#assemblies
                    ? filterAssemblies(this.#assemblies)
                    : filterDomain(Il2Cpp.Domain);
        this.#assemblies = undefined;
        this.#classes = undefined;
        this.#methods = undefined;
        this.#assemblyFilter = undefined;
        this.#classFilter = undefined;
        this.#methodFilter = undefined;
        this.#parameterFilter = undefined;
        return this;
    }
    attach(mode = "full") {
        let count = 0;
        for (const target of this.targets) {
            if (target.virtualAddress.isNull()) {
                continue;
            }
            const offset = `\x1b[2m0x${target.relativeVirtualAddress.toString(16).padStart(8, `0`)}\x1b[0m`;
            const fullName = `${target.class.type.name}.\x1b[1m${target.name}\x1b[0m`;
            if (mode == "detailed") {
                const startIndex = +!target.isStatic | +Il2Cpp.unityVersionIsBelow201830;
                const callback = (...args) => {
                    const thisParameter = target.isStatic ? undefined : new Il2Cpp.Parameter("this", -1, target.class.type);
                    const parameters = thisParameter ? [thisParameter].concat(target.parameters) : target.parameters;
                    (0, console_1.inform)(`\
${offset} ${`│ `.repeat(count++)}┌─\x1b[35m${fullName}\x1b[0m(\
${parameters.map(e => `\x1b[32m${e.name}\x1b[0m = \x1b[31m${(0, utils_1.fromFridaValue)(args[e.position + startIndex], e.type)}\x1b[0m`).join(`, `)});`);
                    const returnValue = target.nativeFunction(...args);
                    (0, console_1.inform)(`\
${offset} ${`│ `.repeat(--count)}└─\x1b[33m${fullName}\x1b[0m\
${returnValue == undefined ? `` : ` = \x1b[36m${(0, utils_1.fromFridaValue)(returnValue, target.returnType)}`}\x1b[0m;`);
                    return returnValue;
                };
                try {
                    target.revert();
                    const nativeCallback = new NativeCallback(callback, target.returnType.fridaAlias, target.fridaSignature);
                    Interceptor.replace(target.virtualAddress, nativeCallback);
                }
                catch (e) { }
            }
            else {
                try {
                    Interceptor.attach(target.virtualAddress, {
                        onEnter: () => (0, console_1.inform)(`${offset} ${`│ `.repeat(count++)}┌─\x1b[35m${fullName}\x1b[0m`),
                        onLeave: () => (0, console_1.inform)(`${offset} ${`│ `.repeat(--count)}└─\x1b[33m${fullName}\x1b[0m${count == 0 ? `\n` : ``}`)
                    });
                }
                catch (e) { }
            }
        }
    }
}
Il2Cpp.Tracer = Il2CppTracer;

},{"../utils/console":168,"./utils":166}],166:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toFridaValue = exports.fromFridaValue = exports.write = exports.read = void 0;
const console_1 = require("../utils/console");
const native_struct_1 = require("../utils/native-struct");
/** @internal */
function read(pointer, type) {
    switch (type.typeEnum) {
        case 2 /* Boolean */:
            return !!pointer.readS8();
        case 4 /* I1 */:
            return pointer.readS8();
        case 5 /* U1 */:
            return pointer.readU8();
        case 6 /* I2 */:
            return pointer.readS16();
        case 7 /* U2 */:
            return pointer.readU16();
        case 8 /* I4 */:
            return pointer.readS32();
        case 9 /* U4 */:
            return pointer.readU32();
        case 3 /* Char */:
            return pointer.readU16();
        case 10 /* I8 */:
            return pointer.readS64();
        case 11 /* U8 */:
            return pointer.readU64();
        case 12 /* R4 */:
            return pointer.readFloat();
        case 13 /* R8 */:
            return pointer.readDouble();
        case 24 /* NativeInteger */:
        case 25 /* UnsignedNativeInteger */:
            return pointer.readPointer();
        case 15 /* Pointer */:
            return new Il2Cpp.Pointer(pointer.readPointer(), type.class.baseType);
        case 17 /* ValueType */:
            return new Il2Cpp.ValueType(pointer, type);
        case 28 /* Object */:
        case 18 /* Class */:
            return new Il2Cpp.Object(pointer.readPointer());
        case 21 /* GenericInstance */:
            return type.class.isValueType ? new Il2Cpp.ValueType(pointer, type) : new Il2Cpp.Object(pointer.readPointer());
        case 14 /* String */:
            return new Il2Cpp.String(pointer.readPointer());
        case 29 /* SingleDimensionalZeroLowerBoundArray */:
        case 20 /* Array */:
            return new Il2Cpp.Array(pointer.readPointer());
    }
    (0, console_1.raise)(`read: "${type.name}" (${type.typeEnum}) has not been handled yet. Please file an issue!`);
}
exports.read = read;
/** @internal */
function write(pointer, value, type) {
    switch (type.typeEnum) {
        case 2 /* Boolean */:
            return pointer.writeS8(+value);
        case 4 /* I1 */:
            return pointer.writeS8(value);
        case 5 /* U1 */:
            return pointer.writeU8(value);
        case 6 /* I2 */:
            return pointer.writeS16(value);
        case 7 /* U2 */:
            return pointer.writeU16(value);
        case 8 /* I4 */:
            return pointer.writeS32(value);
        case 9 /* U4 */:
            return pointer.writeU32(value);
        case 3 /* Char */:
            return pointer.writeU16(value);
        case 10 /* I8 */:
            return pointer.writeS64(value);
        case 11 /* U8 */:
            return pointer.writeU64(value);
        case 12 /* R4 */:
            return pointer.writeFloat(value);
        case 13 /* R8 */:
            return pointer.writeDouble(value);
        case 24 /* NativeInteger */:
        case 25 /* UnsignedNativeInteger */:
        case 15 /* Pointer */:
        case 17 /* ValueType */:
        case 14 /* String */:
        case 28 /* Object */:
        case 18 /* Class */:
        case 29 /* SingleDimensionalZeroLowerBoundArray */:
        case 20 /* Array */:
        case 21 /* GenericInstance */:
            if (value instanceof Il2Cpp.ValueType) {
                Memory.copy(pointer, value.handle, type.class.valueSize);
                return pointer;
            }
            return pointer.writePointer(value);
    }
    (0, console_1.raise)(`write: "${type.name}" (${type.typeEnum}) has not been handled yet. Please file an issue!`);
}
exports.write = write;
/** @internal */
function fromFridaValue(value, type) {
    if (Array.isArray(value)) {
        return arrayToValueType(type, value);
    }
    else if (value instanceof NativePointer) {
        if (type.isByReference) {
            return new Il2Cpp.Reference(value, type);
        }
        switch (type.typeEnum) {
            case 15 /* Pointer */:
                return new Il2Cpp.Pointer(value, type.class.baseType);
            case 14 /* String */:
                return new Il2Cpp.String(value);
            case 18 /* Class */:
            case 21 /* GenericInstance */:
            case 28 /* Object */:
                return new Il2Cpp.Object(value);
            case 29 /* SingleDimensionalZeroLowerBoundArray */:
            case 20 /* Array */:
                return new Il2Cpp.Array(value);
            default:
                return value;
        }
    }
    else if (type.typeEnum == 2 /* Boolean */) {
        return !!value;
    }
    else {
        return value;
    }
}
exports.fromFridaValue = fromFridaValue;
/** @internal */
function toFridaValue(value) {
    if (typeof value == "boolean") {
        return +value;
    }
    else if (value instanceof Il2Cpp.ValueType) {
        return valueTypeToArray(value);
    }
    else {
        return value;
    }
}
exports.toFridaValue = toFridaValue;
function valueTypeToArray(value) {
    const instanceFields = value.type.class.fields.filter(f => !f.isStatic);
    return instanceFields.length == 0
        ? [value.handle.readU8()]
        : instanceFields
            .map(field => field.withHolder(value).value)
            .map(value => value instanceof Il2Cpp.ValueType
            ? valueTypeToArray(value)
            : value instanceof native_struct_1.NativeStruct
                ? value.handle
                : typeof value == "boolean"
                    ? +value
                    : value);
}
function arrayToValueType(type, nativeValues) {
    function iter(type, startOffset = 0) {
        const arr = [];
        for (const field of type.class.fields) {
            if (!field.isStatic) {
                const offset = startOffset + field.offset - Il2Cpp.Runtime.objectHeaderSize;
                if (field.type.typeEnum == 17 /* ValueType */ ||
                    (field.type.typeEnum == 21 /* GenericInstance */ && field.type.class.isValueType)) {
                    arr.push(...iter(field.type, offset));
                }
                else {
                    arr.push([field.type.typeEnum, offset]);
                }
            }
        }
        if (arr.length == 0) {
            arr.push([5 /* U1 */, 0]);
        }
        return arr;
    }
    const valueType = Memory.alloc(type.class.valueSize);
    nativeValues = nativeValues.flat(Infinity);
    const typesAndOffsets = iter(type);
    for (let i = 0; i < nativeValues.length; i++) {
        const value = nativeValues[i];
        const [typeEnum, offset] = typesAndOffsets[i];
        const pointer = valueType.add(offset);
        switch (typeEnum) {
            case 2 /* Boolean */:
                pointer.writeS8(value);
                break;
            case 4 /* I1 */:
                pointer.writeS8(value);
                break;
            case 5 /* U1 */:
                pointer.writeU8(value);
                break;
            case 6 /* I2 */:
                pointer.writeS16(value);
                break;
            case 7 /* U2 */:
                pointer.writeU16(value);
                break;
            case 8 /* I4 */:
                pointer.writeS32(value);
                break;
            case 9 /* U4 */:
                pointer.writeU32(value);
                break;
            case 3 /* Char */:
                pointer.writeU16(value);
                break;
            case 10 /* I8 */:
                pointer.writeS64(value);
                break;
            case 11 /* U8 */:
                pointer.writeU64(value);
                break;
            case 12 /* R4 */:
                pointer.writeFloat(value);
                break;
            case 13 /* R8 */:
                pointer.writeDouble(value);
                break;
            case 24 /* NativeInteger */:
            case 25 /* UnsignedNativeInteger */:
            case 15 /* Pointer */:
            case 29 /* SingleDimensionalZeroLowerBoundArray */:
            case 20 /* Array */:
            case 14 /* String */:
            case 28 /* Object */:
            case 18 /* Class */:
            case 21 /* GenericInstance */:
                pointer.writePointer(value);
                break;
            default:
                (0, console_1.warn)(`arrayToValueType: defaulting ${typeEnum} to pointer`);
                pointer.writePointer(value);
                break;
        }
    }
    return new Il2Cpp.ValueType(valueType, type);
}

},{"../utils/console":168,"../utils/native-struct":169}],167:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./il2cpp");

},{"./il2cpp":144}],168:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inform = exports.ok = exports.warn = exports.raise = void 0;
/** @internal */
function raise(message) {
    throw `\x1B[0m\x1B[38;5;9mil2cpp\x1B[0m: ${message}`;
}
exports.raise = raise;
/** @internal */
function warn(message) {
    globalThis.console.log(`\x1B[38;5;11mil2cpp\x1B[0m: ${message}`);
}
exports.warn = warn;
/** @internal */
function ok(message) {
    globalThis.console.log(`\x1B[38;5;10mil2cpp\x1B[0m: ${message}`);
}
exports.ok = ok;
/** @internal */
function inform(message) {
    globalThis.console.log(`\x1B[38;5;12mil2cpp\x1B[0m: ${message}`);
}
exports.inform = inform;

},{}],169:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonNullNativeStruct = exports.NativeStruct = void 0;
/** Scaffold class. */
class NativeStruct {
    handle;
    constructor(handleOrWrapper) {
        if (handleOrWrapper instanceof NativePointer) {
            this.handle = handleOrWrapper;
        }
        else {
            this.handle = handleOrWrapper.handle;
        }
    }
    equals(other) {
        return this.handle.equals(other.handle);
    }
    isNull() {
        return this.handle.isNull();
    }
}
exports.NativeStruct = NativeStruct;
/** Scaffold class whom pointer cannot be null. */
class NonNullNativeStruct extends NativeStruct {
    constructor(handle) {
        super(handle);
        if (handle.isNull()) {
            throw new Error(`Handle for "${this.constructor.name}" cannot be NULL.`);
        }
    }
}
exports.NonNullNativeStruct = NonNullNativeStruct;

},{}],170:[function(require,module,exports){
(function (setImmediate){(function (){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forModule = void 0;
const decorator_cache_getter_1 = require("decorator-cache-getter");
const versioning_1 = __importDefault(require("versioning"));
class Target {
    stringEncoding;
    address;
    constructor(responsible, name, stringEncoding) {
        this.stringEncoding = stringEncoding;
        this.address = Module.findExportByName(responsible, name) ?? NULL;
    }
    static get targets() {
        function info() {
            switch (Process.platform) {
                case "linux":
                    try {
                        if (versioning_1.default.gte(Java.androidVersion, "12")) {
                            return [null, ["__loader_dlopen", "utf8"]];
                        }
                        else {
                            return ["libdl.so", ["dlopen", "utf8"], ["android_dlopen_ext", "utf8"]];
                        }
                    }
                    catch (e) {
                        return [null, ["dlopen", "utf8"]];
                    }
                case "darwin":
                    return ["libdyld.dylib", ["dlopen", "utf8"]];
                case "windows":
                    const ll = "LoadLibrary";
                    return ["kernel32.dll", [`${ll}W`, "utf16"], [`${ll}ExW`, "utf16"], [`${ll}A`, "ansi"], [`${ll}ExA`, "ansi"]];
            }
        }
        const [responsible, ...targets] = info();
        return targets.map(([name, encoding]) => new Target(responsible, name, encoding)).filter(target => !target.address.isNull());
    }
    readString(pointer) {
        switch (this.stringEncoding) {
            case "utf8":
                return pointer.readUtf8String();
            case "utf16":
                return pointer.readUtf16String();
            case "ansi":
                return pointer.readAnsiString();
        }
    }
}
__decorate([
    decorator_cache_getter_1.cache
], Target, "targets", null);
/** @internal */
function forModule(...moduleNames) {
    return new Promise(resolve => {
        for (const moduleName of moduleNames) {
            const module = Process.findModuleByName(moduleName);
            if (module != null) {
                resolve(moduleName);
                return;
            }
        }
        const interceptors = Target.targets.map(target => Interceptor.attach(target.address, {
            onEnter(args) {
                this.modulePath = target.readString(args[0]) ?? "";
            },
            onLeave(returnValue) {
                if (returnValue.isNull())
                    return;
                for (const moduleName of moduleNames) {
                    if (!this.modulePath.endsWith(moduleName))
                        continue;
                    setImmediate(() => interceptors.forEach(i => i.detach()));
                    resolve(moduleName);
                }
            }
        }));
    });
}
exports.forModule = forModule;

}).call(this)}).call(this,require("timers").setImmediate)

},{"decorator-cache-getter":139,"timers":173,"versioning":174}],171:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.levenshtein = exports.cacheInstances = exports.nativeIterator = void 0;
const fastest_levenshtein_1 = require("fastest-levenshtein");
const console_1 = require("./console");
/** @internal */
function* nativeIterator(holder, nativeFunction, Class) {
    const iterator = Memory.alloc(Process.pointerSize);
    let handle;
    while (!(handle = nativeFunction(holder, iterator)).isNull()) {
        yield new Class(handle);
    }
}
exports.nativeIterator = nativeIterator;
/** @internal */
function cacheInstances(Class) {
    const instanceCache = new Map();
    return new Proxy(Class, {
        construct(Target, argArray) {
            const handle = argArray[0].toUInt32();
            if (!instanceCache.has(handle)) {
                instanceCache.set(handle, new Target(argArray[0]));
            }
            return instanceCache.get(handle);
        }
    });
}
exports.cacheInstances = cacheInstances;
/** @internal */
function levenshtein(candidatesKey, nameGetter = e => e.name) {
    return function (_, propertyKey, descriptor) {
        const original = descriptor.value;
        descriptor.value = function (key, ...args) {
            const result = original.call(this, key, ...args);
            if (result != null)
                return result;
            const closestMatch = (0, fastest_levenshtein_1.closest)(key, this[candidatesKey].map(nameGetter));
            (0, console_1.raise)(`couldn't find ${propertyKey} ${key} in ${this.name}${closestMatch ? `, did you mean ${closestMatch}?` : ``}`);
        };
    };
}
exports.levenshtein = levenshtein;

},{"./console":168,"fastest-levenshtein":140}],172:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],173:[function(require,module,exports){
(function (setImmediate,clearImmediate){(function (){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this)}).call(this,require("timers").setImmediate,require("timers").clearImmediate)

},{"process/browser.js":172,"timers":173}],174:[function(require,module,exports){
/**
 * Semantic Version Number
 * @author 闲耘 <hotoo.cn@gmail.com>
 *
 * @usage
 *    var version = new Versioning("1.2.3")
 *    version > 1
 *    version.eq(1)
 */


// Semantic Versioning Delimiter.
var delimiter = ".";

var Version = function(version){
  this._version = String(version);
};

function compare(v1, v2, complete){
  v1 = String(v1);
  v2 = String(v2);
  if(v1 === v2){return 0;}
  var v1s = v1.split(delimiter);
  var v2s = v2.split(delimiter);
  var len = Math[complete ? "max" : "min"](v1s.length, v2s.length);
  for(var i=0; i<len; i++){
    v1s[i] = "undefined"===typeof v1s[i] ? 0 : parseInt(v1s[i], 10);
    v2s[i] = "undefined"===typeof v2s[i] ? 0 : parseInt(v2s[i], 10);
    if(v1s[i] > v2s[i]){return 1;}
    if(v1s[i] < v2s[i]){return -1;}
  }
  return 0;
}

Version.compare = function(v1, v2){
  return compare(v1, v2, true);
};

/**
 * @param {String} v1.
 * @param {String} v2.
 * @return {Boolean} true if v1 equals v2.
 *
 *    Version.eq("6.1", "6"); // true.
 *    Version.eq("6.1.2", "6.1"); // true.
 */
Version.eq = function(v1, v2, strict){
  return compare(v1, v2, strict) === 0;
};

/**
 * @param {String} v1.
 * @param {String} v2.
 * @return {Boolean} return true
 */
Version.gt = function(v1, v2){
  return compare(v1, v2, true) > 0;
};

Version.gte = function(v1, v2){
  return compare(v1, v2, true) >= 0;
};

Version.lt = function(v1, v2){
  return compare(v1, v2, true) < 0;
};

Version.lte = function(v1, v2){
  return compare(v1, v2, true) <= 0;
};

Version.prototype = {
  // new Version("6.1").eq(6); // true.
  // new Version("6.1.2").eq("6.1"); // true.
  eq: function(version){
    return Version.eq(this._version, version);
  },

  gt: function(version){
    return Version.gt(this._version, version);
  },

  gte: function(version){
    return Version.gte(this._version, version);
  },

  lt: function(version){
    return Version.lt(this._version, version);
  },

  lte: function(version){
    return Version.lte(this._version, version);
  },

  valueOf: function(){
    return parseFloat(
      this._version.split(delimiter).slice(0, 2).join(delimiter),
      10);
  },

  /**
   * XXX: ""+ver 调用的转型方法是 valueOf，而不是 toString，这个有点悲剧。
   * 只能使用 String(ver) 或 ver.toString() 方法。
   * @param {Number} precision, 返回的版本号精度。默认返回完整版本号。
   * @return {String}
   */
  toString: function(precision){
    return "undefined" === typeof precision ? this._version :
      this._version.split(delimiter).slice(0, precision).join(delimiter);
  }
};


module.exports = Version;

},{}]},{},[120])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZ2VudC9BUEkvbGlzdC50cyIsImFnZW50L0FQSS90ZXh0LnRzIiwiYWdlbnQvYmFzZS9iYXNlLnRzIiwiYWdlbnQvYmFzZS9icmVha2VyLnRzIiwiYWdlbnQvYmFzZS9lbnVtLnRzIiwiYWdlbnQvYmFzZS9nbG9ibGUudHMiLCJhZ2VudC9iYXNlL2luZm8udHMiLCJhZ2VudC9iYXNlL3ZhbHVlUmVzb2x2ZS50cyIsImFnZW50L2JyaWRnZS9leHBhbmQvcGFja2VyLnRzIiwiYWdlbnQvYnJpZGdlL2ZpeC9JbDJjcHBDbGFzcy50cyIsImFnZW50L2JyaWRnZS9maXgvaWwyY3BwTWV0aG9kLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL19pbmNsdWRlLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL2FwaUV4dGVuZHMvYXBpRXh0ZW5kcy50cyIsImFnZW50L2V4cGFuZC9UeXBlRXh0ZW5kcy9tc2NvcmxpYk9iai9BYnN0cmFjdEV2ZW50RGF0YS9CYXNlRXZlbnREYXRhL1BvaW50ZXJFdmVudERhdGEvYXBpLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL0Fic3RyYWN0RXZlbnREYXRhL0Jhc2VFdmVudERhdGEvUG9pbnRlckV2ZW50RGF0YS9jbGFzcy50cyIsImFnZW50L2V4cGFuZC9UeXBlRXh0ZW5kcy9tc2NvcmxpYk9iai9BYnN0cmFjdEV2ZW50RGF0YS9CYXNlRXZlbnREYXRhL1BvaW50ZXJFdmVudERhdGEvZXhwb3J0LnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL0Fic3RyYWN0RXZlbnREYXRhL0Jhc2VFdmVudERhdGEvUG9pbnRlckV2ZW50RGF0YS9pbmNsdWRlLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL0Fic3RyYWN0RXZlbnREYXRhL0Jhc2VFdmVudERhdGEvUG9pbnRlckV2ZW50RGF0YS9pbnRlcmZhY2UudHMiLCJhZ2VudC9leHBhbmQvVHlwZUV4dGVuZHMvbXNjb3JsaWJPYmovQWJzdHJhY3RFdmVudERhdGEvQmFzZUV2ZW50RGF0YS9hcGkudHMiLCJhZ2VudC9leHBhbmQvVHlwZUV4dGVuZHMvbXNjb3JsaWJPYmovQWJzdHJhY3RFdmVudERhdGEvQmFzZUV2ZW50RGF0YS9jbGFzcy50cyIsImFnZW50L2V4cGFuZC9UeXBlRXh0ZW5kcy9tc2NvcmxpYk9iai9BYnN0cmFjdEV2ZW50RGF0YS9CYXNlRXZlbnREYXRhL2luY2x1ZGUudHMiLCJhZ2VudC9leHBhbmQvVHlwZUV4dGVuZHMvbXNjb3JsaWJPYmovQWJzdHJhY3RFdmVudERhdGEvYXBpLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL0Fic3RyYWN0RXZlbnREYXRhL2NsYXNzLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL0Fic3RyYWN0RXZlbnREYXRhL2luY2x1ZGUudHMiLCJhZ2VudC9leHBhbmQvVHlwZUV4dGVuZHMvbXNjb3JsaWJPYmovRGVidWcvYXBpLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL0RlYnVnL2V4cG9ydC50cyIsImFnZW50L2V4cGFuZC9UeXBlRXh0ZW5kcy9tc2NvcmxpYk9iai9EZWJ1Zy9pbmNsdWRlLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL0dVSS9pbmNsdWRlLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL0lucHV0L2luY2x1ZGUudHMiLCJhZ2VudC9leHBhbmQvVHlwZUV4dGVuZHMvbXNjb3JsaWJPYmovT2JqZWN0L0Fzc2V0QnVuZGxlL2luY2x1ZGUudHMiLCJhZ2VudC9leHBhbmQvVHlwZUV4dGVuZHMvbXNjb3JsaWJPYmovT2JqZWN0L0F2YXRhci9pbmNsdWRlLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL09iamVjdC9Db21wb25lbnQvQmVoYXZpb3IvQW5pbWF0aW9uL2luY2x1ZGUudHMiLCJhZ2VudC9leHBhbmQvVHlwZUV4dGVuZHMvbXNjb3JsaWJPYmovT2JqZWN0L0NvbXBvbmVudC9CZWhhdmlvci9BbmltYXRvci9pbmNsdWRlLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL09iamVjdC9Db21wb25lbnQvQmVoYXZpb3IvQXVkaW9Tb3Vyc2UvaW5jbHVkZS50cyIsImFnZW50L2V4cGFuZC9UeXBlRXh0ZW5kcy9tc2NvcmxpYk9iai9PYmplY3QvQ29tcG9uZW50L0JlaGF2aW9yL0NhbWVyYS9pbmNsdWRlLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL09iamVjdC9Db21wb25lbnQvQmVoYXZpb3IvTGlnaHQvaW5jbHVkZS50cyIsImFnZW50L2V4cGFuZC9UeXBlRXh0ZW5kcy9tc2NvcmxpYk9iai9PYmplY3QvQ29tcG9uZW50L0JlaGF2aW9yL01vbm9CZWhhdmlvdXIvU2VsZWN0YWJsZS9CdXR0b24vYXBpLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL09iamVjdC9Db21wb25lbnQvQmVoYXZpb3IvTW9ub0JlaGF2aW91ci9TZWxlY3RhYmxlL0J1dHRvbi9jbGFzcy50cyIsImFnZW50L2V4cGFuZC9UeXBlRXh0ZW5kcy9tc2NvcmxpYk9iai9PYmplY3QvQ29tcG9uZW50L0JlaGF2aW9yL01vbm9CZWhhdmlvdXIvU2VsZWN0YWJsZS9CdXR0b24vZXhwb3J0LnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL09iamVjdC9Db21wb25lbnQvQmVoYXZpb3IvTW9ub0JlaGF2aW91ci9TZWxlY3RhYmxlL0J1dHRvbi9pbmNsdWRlLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL09iamVjdC9Db21wb25lbnQvQmVoYXZpb3IvTW9ub0JlaGF2aW91ci9TZWxlY3RhYmxlL2FwaS50cyIsImFnZW50L2V4cGFuZC9UeXBlRXh0ZW5kcy9tc2NvcmxpYk9iai9PYmplY3QvQ29tcG9uZW50L0JlaGF2aW9yL01vbm9CZWhhdmlvdXIvU2VsZWN0YWJsZS9jbGFzcy50cyIsImFnZW50L2V4cGFuZC9UeXBlRXh0ZW5kcy9tc2NvcmxpYk9iai9PYmplY3QvQ29tcG9uZW50L0JlaGF2aW9yL01vbm9CZWhhdmlvdXIvU2VsZWN0YWJsZS9pbmNsdWRlLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL09iamVjdC9Db21wb25lbnQvQmVoYXZpb3IvTW9ub0JlaGF2aW91ci9hcGkudHMiLCJhZ2VudC9leHBhbmQvVHlwZUV4dGVuZHMvbXNjb3JsaWJPYmovT2JqZWN0L0NvbXBvbmVudC9CZWhhdmlvci9Nb25vQmVoYXZpb3VyL2NsYXNzLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL09iamVjdC9Db21wb25lbnQvQmVoYXZpb3IvTW9ub0JlaGF2aW91ci9pbmNsdWRlLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL09iamVjdC9Db21wb25lbnQvQmVoYXZpb3IvTmV0d29ya1ZpZXcvaW5jbHVkZS50cyIsImFnZW50L2V4cGFuZC9UeXBlRXh0ZW5kcy9tc2NvcmxpYk9iai9PYmplY3QvQ29tcG9uZW50L0JlaGF2aW9yL2luY2x1ZGUudHMiLCJhZ2VudC9leHBhbmQvVHlwZUV4dGVuZHMvbXNjb3JsaWJPYmovT2JqZWN0L0NvbXBvbmVudC9Db2xsaWRlci9DaGFyYWN0ZXJDb250cm9sbGVyL2luY2x1ZGUudHMiLCJhZ2VudC9leHBhbmQvVHlwZUV4dGVuZHMvbXNjb3JsaWJPYmovT2JqZWN0L0NvbXBvbmVudC9Db2xsaWRlci9pbmNsdWRlLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL09iamVjdC9Db21wb25lbnQvUGFydGljbGVTeXN0ZW0vaW5jbHVkZS50cyIsImFnZW50L2V4cGFuZC9UeXBlRXh0ZW5kcy9tc2NvcmxpYk9iai9PYmplY3QvQ29tcG9uZW50L1JlbmRlcmVyL2luY2x1ZGUudHMiLCJhZ2VudC9leHBhbmQvVHlwZUV4dGVuZHMvbXNjb3JsaWJPYmovT2JqZWN0L0NvbXBvbmVudC9SaWdpZGJvZHkvaW5jbHVkZS50cyIsImFnZW50L2V4cGFuZC9UeXBlRXh0ZW5kcy9tc2NvcmxpYk9iai9PYmplY3QvQ29tcG9uZW50L1RyYW5zZm9ybS9hcGkudHMiLCJhZ2VudC9leHBhbmQvVHlwZUV4dGVuZHMvbXNjb3JsaWJPYmovT2JqZWN0L0NvbXBvbmVudC9UcmFuc2Zvcm0vY2xhc3MudHMiLCJhZ2VudC9leHBhbmQvVHlwZUV4dGVuZHMvbXNjb3JsaWJPYmovT2JqZWN0L0NvbXBvbmVudC9UcmFuc2Zvcm0vZXhwb3J0LnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL09iamVjdC9Db21wb25lbnQvVHJhbnNmb3JtL2luY2x1ZGUudHMiLCJhZ2VudC9leHBhbmQvVHlwZUV4dGVuZHMvbXNjb3JsaWJPYmovT2JqZWN0L0NvbXBvbmVudC9hcGkudHMiLCJhZ2VudC9leHBhbmQvVHlwZUV4dGVuZHMvbXNjb3JsaWJPYmovT2JqZWN0L0NvbXBvbmVudC9jbGFzcy50cyIsImFnZW50L2V4cGFuZC9UeXBlRXh0ZW5kcy9tc2NvcmxpYk9iai9PYmplY3QvQ29tcG9uZW50L2V4cG9ydC50cyIsImFnZW50L2V4cGFuZC9UeXBlRXh0ZW5kcy9tc2NvcmxpYk9iai9PYmplY3QvQ29tcG9uZW50L2luY2x1ZGUudHMiLCJhZ2VudC9leHBhbmQvVHlwZUV4dGVuZHMvbXNjb3JsaWJPYmovT2JqZWN0L0dhbWVPYmplY3QvYXBpLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL09iamVjdC9HYW1lT2JqZWN0L2NsYXNzLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL09iamVjdC9HYW1lT2JqZWN0L2V4cG9ydC50cyIsImFnZW50L2V4cGFuZC9UeXBlRXh0ZW5kcy9tc2NvcmxpYk9iai9PYmplY3QvR2FtZU9iamVjdC9pbmNsdWRlLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL09iamVjdC9NYXRlcmlhbC9pbmNsdWRlLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL09iamVjdC9NZXNoL2luY2x1ZGUudHMiLCJhZ2VudC9leHBhbmQvVHlwZUV4dGVuZHMvbXNjb3JsaWJPYmovT2JqZWN0L01vbnRpb24vaW5jbHVkZS50cyIsImFnZW50L2V4cGFuZC9UeXBlRXh0ZW5kcy9tc2NvcmxpYk9iai9PYmplY3QvU2hhZGVyL2luY2x1ZGUudHMiLCJhZ2VudC9leHBhbmQvVHlwZUV4dGVuZHMvbXNjb3JsaWJPYmovT2JqZWN0L1Nwcml0ZS9pbmNsdWRlLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL09iamVjdC9hcGkudHMiLCJhZ2VudC9leHBhbmQvVHlwZUV4dGVuZHMvbXNjb3JsaWJPYmovT2JqZWN0L2NsYXNzLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL09iamVjdC9pbmNsdWRlLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL1BoeXNpY3MvaW5jbHVkZS50cyIsImFnZW50L2V4cGFuZC9UeXBlRXh0ZW5kcy9tc2NvcmxpYk9iai9QbGF5ZXJQcmVmcy9hcGkudHMiLCJhZ2VudC9leHBhbmQvVHlwZUV4dGVuZHMvbXNjb3JsaWJPYmovUGxheWVyUHJlZnMvY2xhc3MudHMiLCJhZ2VudC9leHBhbmQvVHlwZUV4dGVuZHMvbXNjb3JsaWJPYmovUGxheWVyUHJlZnMvZXhwb3J0LnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL1BsYXllclByZWZzL2luY2x1ZGUudHMiLCJhZ2VudC9leHBhbmQvVHlwZUV4dGVuZHMvbXNjb3JsaWJPYmovUmVzb3VyY2VzL2luY2x1ZGUudHMiLCJhZ2VudC9leHBhbmQvVHlwZUV4dGVuZHMvbXNjb3JsaWJPYmovUnVudGltZVR5cGVIYW5kbGUvYXBpLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL1J1bnRpbWVUeXBlSGFuZGxlL2NsYXNzLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL1J1bnRpbWVUeXBlSGFuZGxlL2luY2x1ZGUudHMiLCJhZ2VudC9leHBhbmQvVHlwZUV4dGVuZHMvbXNjb3JsaWJPYmovUnVudGltZVR5cGUvYXBpLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL1J1bnRpbWVUeXBlL2NsYXNzLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL1J1bnRpbWVUeXBlL2luY2x1ZGUudHMiLCJhZ2VudC9leHBhbmQvVHlwZUV4dGVuZHMvbXNjb3JsaWJPYmovVGltZXMvaW5jbHVkZS50cyIsImFnZW50L2V4cGFuZC9UeXBlRXh0ZW5kcy9tc2NvcmxpYk9iai9UeXBlL2FwaS50cyIsImFnZW50L2V4cGFuZC9UeXBlRXh0ZW5kcy9tc2NvcmxpYk9iai9UeXBlL2NsYXNzLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL1R5cGUvaW5jbHVkZS50cyIsImFnZW50L2V4cGFuZC9UeXBlRXh0ZW5kcy9tc2NvcmxpYk9iai9WYWx1ZVR5cGUvQ29sb3IvYXBpLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL1ZhbHVlVHlwZS9Db2xvci9jbGFzcy50cyIsImFnZW50L2V4cGFuZC9UeXBlRXh0ZW5kcy9tc2NvcmxpYk9iai9WYWx1ZVR5cGUvQ29sb3IvZXhwb3J0LnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL1ZhbHVlVHlwZS9WZWN0b3IzL2NsYXNzLnRzIiwiYWdlbnQvZXhwYW5kL1R5cGVFeHRlbmRzL21zY29ybGliT2JqL1ZhbHVlVHlwZS9jbGFzcy50cyIsImFnZW50L2V4cGFuZC9UeXBlRXh0ZW5kcy9tc2NvcmxpYk9iai9hcGkudHMiLCJhZ2VudC9leHBhbmQvVHlwZUV4dGVuZHMvbXNjb3JsaWJPYmovY2xhc3MudHMiLCJhZ2VudC9leHBhbmQvVHlwZUV4dGVuZHMvbXNjb3JsaWJPYmovaW5jbHVkZS50cyIsImFnZW50L2V4cGFuZC9UeXBlRXh0ZW5kcy90aHJlYWQvX2luY2x1ZGUudHMiLCJhZ2VudC9leHBhbmQvVHlwZUV4dGVuZHMvdGhyZWFkL3RocmVhZC50cyIsImFnZW50L2V4cGFuZC9pbmNsdWRlLnRzIiwiYWdlbnQvZ2xvYmVsLnRzIiwiYWdlbnQvaW5jbHVkZS50cyIsImFnZW50L2luZGV4LnRzIiwiYWdlbnQvamF2YS9pbmZvLnRzIiwiYWdlbnQvbmF0aXZlL2luY2x1ZGUudHMiLCJhZ2VudC9uYXRpdmUvc3RkL19pbmNsdWRlLnRzIiwiYWdlbnQvbmF0aXZlL3N0ZC9zdGRfZGVxdWUuanMiLCJhZ2VudC9uYXRpdmUvc3RkL3N0ZF9zdHJpbmcuanMiLCJhZ2VudC9uYXRpdmUvc3RkL3N0ZF92ZWN0b3IuanMiLCJhZ2VudC91dGlscy9faW5jbHVkZS50cyIsImFnZW50L3V0aWxzL2FsbG9jLnRzIiwiYWdlbnQvdXRpbHMvY2FjaGUudHMiLCJhZ2VudC91dGlscy9jYWxsZXIudHMiLCJhZ2VudC91dGlscy9jaGVja1AudHMiLCJhZ2VudC91dGlscy9jb21tb24udHMiLCJhZ2VudC91dGlscy9jb250ZXh0LnRzIiwiYWdlbnQvdXRpbHMvZm9ybWFydC50cyIsImFnZW50L3V0aWxzL2xvZ2dlci50cyIsImFnZW50L3V0aWxzL21hdGgudHMiLCJhZ2VudC91dGlscy9yZWFkZXIudHMiLCJhZ2VudC91dGlscy9zdGFjay50cyIsIm5vZGVfbW9kdWxlcy9kZWNvcmF0b3ItY2FjaGUtZ2V0dGVyL2Rpc3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZmFzdGVzdC1sZXZlbnNodGVpbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mcmlkYS1pbDJjcHAtYnJpZGdlL2Rpc3QvaWwyY3BwL2FwaS5qcyIsIm5vZGVfbW9kdWxlcy9mcmlkYS1pbDJjcHAtYnJpZGdlL2Rpc3QvaWwyY3BwL2Jhc2UuanMiLCJub2RlX21vZHVsZXMvZnJpZGEtaWwyY3BwLWJyaWRnZS9kaXN0L2lsMmNwcC9maWx0ZXJpbmcuanMiLCJub2RlX21vZHVsZXMvZnJpZGEtaWwyY3BwLWJyaWRnZS9kaXN0L2lsMmNwcC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mcmlkYS1pbDJjcHAtYnJpZGdlL2Rpc3QvaWwyY3BwL3J1bnRpbWUuanMiLCJub2RlX21vZHVsZXMvZnJpZGEtaWwyY3BwLWJyaWRnZS9kaXN0L2lsMmNwcC9zdHJ1Y3RzL2FycmF5LmpzIiwibm9kZV9tb2R1bGVzL2ZyaWRhLWlsMmNwcC1icmlkZ2UvZGlzdC9pbDJjcHAvc3RydWN0cy9hc3NlbWJseS5qcyIsIm5vZGVfbW9kdWxlcy9mcmlkYS1pbDJjcHAtYnJpZGdlL2Rpc3QvaWwyY3BwL3N0cnVjdHMvY2xhc3MuanMiLCJub2RlX21vZHVsZXMvZnJpZGEtaWwyY3BwLWJyaWRnZS9kaXN0L2lsMmNwcC9zdHJ1Y3RzL2RvbWFpbi5qcyIsIm5vZGVfbW9kdWxlcy9mcmlkYS1pbDJjcHAtYnJpZGdlL2Rpc3QvaWwyY3BwL3N0cnVjdHMvZmllbGQuanMiLCJub2RlX21vZHVsZXMvZnJpZGEtaWwyY3BwLWJyaWRnZS9kaXN0L2lsMmNwcC9zdHJ1Y3RzL2djLWhhbmRsZS5qcyIsIm5vZGVfbW9kdWxlcy9mcmlkYS1pbDJjcHAtYnJpZGdlL2Rpc3QvaWwyY3BwL3N0cnVjdHMvZ2MuanMiLCJub2RlX21vZHVsZXMvZnJpZGEtaWwyY3BwLWJyaWRnZS9kaXN0L2lsMmNwcC9zdHJ1Y3RzL2ltYWdlLmpzIiwibm9kZV9tb2R1bGVzL2ZyaWRhLWlsMmNwcC1icmlkZ2UvZGlzdC9pbDJjcHAvc3RydWN0cy9tZW1vcnktc25hcHNob3QuanMiLCJub2RlX21vZHVsZXMvZnJpZGEtaWwyY3BwLWJyaWRnZS9kaXN0L2lsMmNwcC9zdHJ1Y3RzL21ldGhvZC5qcyIsIm5vZGVfbW9kdWxlcy9mcmlkYS1pbDJjcHAtYnJpZGdlL2Rpc3QvaWwyY3BwL3N0cnVjdHMvb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2ZyaWRhLWlsMmNwcC1icmlkZ2UvZGlzdC9pbDJjcHAvc3RydWN0cy9wYXJhbWV0ZXIuanMiLCJub2RlX21vZHVsZXMvZnJpZGEtaWwyY3BwLWJyaWRnZS9kaXN0L2lsMmNwcC9zdHJ1Y3RzL3BvaW50ZXIuanMiLCJub2RlX21vZHVsZXMvZnJpZGEtaWwyY3BwLWJyaWRnZS9kaXN0L2lsMmNwcC9zdHJ1Y3RzL3JlZmVyZW5jZS5qcyIsIm5vZGVfbW9kdWxlcy9mcmlkYS1pbDJjcHAtYnJpZGdlL2Rpc3QvaWwyY3BwL3N0cnVjdHMvc3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2ZyaWRhLWlsMmNwcC1icmlkZ2UvZGlzdC9pbDJjcHAvc3RydWN0cy90aHJlYWQuanMiLCJub2RlX21vZHVsZXMvZnJpZGEtaWwyY3BwLWJyaWRnZS9kaXN0L2lsMmNwcC9zdHJ1Y3RzL3R5cGUtZW51bS5qcyIsIm5vZGVfbW9kdWxlcy9mcmlkYS1pbDJjcHAtYnJpZGdlL2Rpc3QvaWwyY3BwL3N0cnVjdHMvdHlwZS5qcyIsIm5vZGVfbW9kdWxlcy9mcmlkYS1pbDJjcHAtYnJpZGdlL2Rpc3QvaWwyY3BwL3N0cnVjdHMvdmFsdWUtdHlwZS5qcyIsIm5vZGVfbW9kdWxlcy9mcmlkYS1pbDJjcHAtYnJpZGdlL2Rpc3QvaWwyY3BwL3RyYWNlci5qcyIsIm5vZGVfbW9kdWxlcy9mcmlkYS1pbDJjcHAtYnJpZGdlL2Rpc3QvaWwyY3BwL3V0aWxzLmpzIiwibm9kZV9tb2R1bGVzL2ZyaWRhLWlsMmNwcC1icmlkZ2UvZGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mcmlkYS1pbDJjcHAtYnJpZGdlL2Rpc3QvdXRpbHMvY29uc29sZS5qcyIsIm5vZGVfbW9kdWxlcy9mcmlkYS1pbDJjcHAtYnJpZGdlL2Rpc3QvdXRpbHMvbmF0aXZlLXN0cnVjdC5qcyIsIm5vZGVfbW9kdWxlcy9mcmlkYS1pbDJjcHAtYnJpZGdlL2Rpc3QvdXRpbHMvbmF0aXZlLXdhaXQuanMiLCJub2RlX21vZHVsZXMvZnJpZGEtaWwyY3BwLWJyaWRnZS9kaXN0L3V0aWxzL3V0aWxzLmpzIiwibm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy90aW1lcnMtYnJvd3NlcmlmeS9tYWluLmpzIiwibm9kZV9tb2R1bGVzL3ZlcnNpb25pbmcvdmVyc2lvbmluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOzs7O0FDQ0EsNENBQStDO0FBRS9DOzs7R0FHRztBQUNILElBQUksV0FBVyxHQUFHLENBQUMsSUFBUyxFQUFVLEVBQUU7SUFDcEMsSUFBSSxHQUFHLElBQUEsc0JBQWEsRUFBQyxJQUFJLENBQUMsQ0FBQTtJQUMxQixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFBRSxPQUFPLEVBQUUsQ0FBQTtJQUM1QixPQUFPLEVBQUUsQ0FBQTtJQUNULDRGQUE0RjtBQUNoRyxDQUFDLENBQUE7Ozs7Ozs7Ozs7O0FDWkQsbUVBQStDO0FBQy9DLHFDQUFrQztBQUNsQyw2REFBK0Q7QUFDL0QsMENBQTJDO0FBQzNDLGlDQUFrQztBQUNsQyw4Q0FBZ0Q7QUFFaEQsTUFBTSxVQUFVO0lBQ1osZ0JBQWdCLENBQUM7SUFHakIsTUFBTSxLQUFLLGdCQUFnQjtRQUN2QixPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFBO0lBQ25DLENBQUM7SUFHRCxNQUFNLEtBQUssc0JBQXNCO1FBQzdCLE9BQU8sVUFBVSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUM3RCxDQUFDO0lBR0QsTUFBTSxLQUFLLFlBQVk7UUFDbkIsT0FBTyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBeUIsRUFBRSxFQUFF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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3B1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDcE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzlHQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xQQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIn0=
