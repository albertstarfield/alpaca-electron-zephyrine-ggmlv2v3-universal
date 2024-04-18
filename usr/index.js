/*
DEBUGGING TIPS
For enabling the more verbose output of the console logs you could add this environment variable and set to "1"

INTERNET_FETCH_DEBUG_MODE
LOCAL_FETCH_DEBUG_MODE
CoTMultiSteps_FETCH_DEBUG_MODE
ptyinteractionStgDEBUG
ptyStreamDEBUGMode
HISTORY_CTX_FETCH_DEBUG_MODE

*/
//https://stackoverflow.com/questions/72591633/electron-simplest-example-to-pass-variable-from-js-to-html-using-ipc-contextb
/**
 * Render --> Main
 * ---------------
 * Render:  window.ipcRender.send('channel', data); // Data is optional.
 * Main:    electronIpcMain.on('channel', (event, data) => { methodName(data); })
 *
 * Main --> Render
 * ---------------
 * Main:    windowName.webContents.send('channel', data); // Data is optional.
 * Render:  window.ipcRender.receive('channel', (data) => { methodName(data); });
 *
 * Render --> Main (Value) --> Render
 * ----------------------------------
 * Render:  window.ipcRender.invoke('channel', data).then((result) => { methodName(result); });
 * Main:    electronIpcMain.handle('channel', (event, data) => { return someMethod(data); });
 *
 * Render --> Main (Promise) --> Render
 * ------------------------------------
 * Render:  window.ipcRender.invoke('channel', data).then((result) => { methodName(result); });
 * Main:    electronIpcMain.handle('channel', async (event, data) => {
 *              return await promiseName(data)
 *                  .then(() => { return result; })
 *          });
 * 
 * Who we are, how far we gone
* Let us heal the misery and plant the seed we ever promised
* Time is up, go grab your arms
* No matter how hard we have been
* We shall fight forever
 * 
 * 
 */


const { BrowserWindow, app, ipcMain, dialog } = require("electron");
const { spawn } = require('child_process');
const ipcRenderer = require("electron").ipcRenderer;
const contextBridge = require('electron').contextBridge;
const path = require("path");
//const { download } = require('electron-dl');
const https = require('https');
const http = require('http');
require("@electron/remote/main").initialize();
const os = require("os");
const osUtils = require('os-utils');
const gpuInfo = require('gpu-info');
const platform = os.platform();
const arch = os.arch();
const colorReset = "\x1b[0m";
const colorBrightCyan = "\x1b[96m";
const assistantName = "Adelaide Zephyrine Charlotte";
const natural = require('natural');
const appName = `Project ${assistantName}`;
const username = os.userInfo().username;
const engineName = `Adelaide Paradigm Engine`
const consoleLogPrefix = `[${colorBrightCyan}${engineName}_${platform}_${arch}${colorReset}]:`;
const { memoryUsage } = require('node:process');
const log = require('electron-log');
let logPathFile;
const { createLogger, transports, format } = require('winston');
const nlp = require('compromise');
const axios = require('axios');
const cheerio = require('cheerio');
// for accessing the internet
let internetUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'

let resumeFeatureReadyRelease = false; // Download resume feature after timeout is ready yet or no? (true or false)?


var win;
function createWindow() {
	win = new BrowserWindow({
		width: 1200,
		height: 810,
		minWidth: 780,
		minHeight: 600,
		frame: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true,
			devTools: true
		},
		titleBarStyle: "hidden",
		icon: platform == "darwin" ? path.join(__dirname, "icon", "mac", "icon.icns") : path.join(__dirname, "icon", "png", "128x128.png")
	});
	require("@electron/remote/main").enable(win.webContents);

	win.loadFile(path.resolve(__dirname, "src", "index.html"));
	
	// after main window and main process initialize the electron core send the global.username and global.assistantName to the global bot
	win.setMenu(null);
	// win.webContents.openDevTools();


	//Monitor User Interaction, and if its idle then throttle back to 1 fps after 2 seconds inactivity
	// Set the initial frame rate to full FPS
    let isIdle = false;

    // Function to set frame rate
    const setFrameRate = (fps) => {
        win.webContents.executeJavaScript(`document.body.style.setProperty('--fps', '${fps}')`);
    };
	/*
    // Detect mouse move event
    let mouseTimeout;
    const resetMouseTimeout = () => {
        clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(() => {
            if (!isIdle) {
                isIdle = true;
                setFrameRate(1); // Set frame rate to 1 FPS
            }
        }, 15000); // 15 seconds idle timeout
    };

    win.on('mousemove', resetMouseTimeout);

    // Detect keyboard input event
    let keyboardTimeout;
    const resetKeyboardTimeout = () => {
        clearTimeout(keyboardTimeout);
        keyboardTimeout = setTimeout(() => {
            if (!isIdle) {
                isIdle = true;
                setFrameRate(1); // Set frame rate to 1 FPS
            }
        }, 30000); // 30 seconds idle timeout
    };

    win.on('keydown', resetKeyboardTimeout);

    // Reset idle state when mouse or keyboard is detected
    win.on('mousemove', () => {
        if (isIdle) {
            isIdle = false;
            setFrameRate(60); // Resume full FPS
        }
    });

    win.on('keydown', () => {
        if (isIdle) {
            isIdle = false;
            setFrameRate(60); // Resume full FPS
        }
    });
	*/
}
// Log Configuration
logPathFile = path.resolve(__dirname, "AdelaideRuntimeCore.log")
log.info(logPathFile);
log.transports.file.file = logPathFile;
log.transports.file.level = 'debug'; // Set the desired log level

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        // Console transport (removed to prevent logging to console)
        // new transports.Console(),

        // File transport for info level messages only
        new transports.File({ filename: logPathFile, level: 'info' })
    ]
});

//custom icon for the dock on darwin based os using QE/CI engine
if (os.platform() == "darwin"){
const electron = require('electron'); // Import the electron module
const app = electron.app;
const image = electron.nativeImage.createFromPath(
  app.getAppPath() + "/" + path.join("icon", "mac", "icon.icns")
);
app.dock.setIcon(image);
app.name = assistantName;
}


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

app.on("second-instance", () => {
	if (win) {
		if (win.isMinimized()) win.restore();
		win.focus();
	}
});

app.on("ready", () => {
	createWindow(); //Loads html

});

app.on("window-all-closed", () => {
	app.quit();
});
app.on("activate", () => {
	if (win == null) createWindow();
});
app.on("before-quit", () => {
	if (runningShell) runningShell.kill();
});

// OS STATS

const osUtil = require("os-utils");
var threads;
var sysThreads = osUtil.cpuCount();
for (let i = 1; i < sysThreads; i = i * 2) {
	threads = i;
}
if (sysThreads == 4) {
	threads = 4;
}

// username
ipcMain.on("username", () => {
	win.webContents.send("username", {
		data: username
	});
});
// Assistant name is one of the operating system part
ipcMain.on("assistantName", () => {
	win.webContents.send("assistantName", {
		data: assistantName
	});
});

ipcMain.on("cpuUsage", () => {
	osUtil.cpuUsage(function (v) {
		win.webContents.send("cpuUsage", { data: v });
	});
});

ipcMain.on("timingDegradationCheckFactor", () => {
	win.webContents.send("timingDegradationFactorReciever_renderer", { data: degradedFactor });
});


ipcMain.on("timingDegradationCheck", () => {
	win.webContents.send("timingDegradationReciever_renderer", { data: timeInnacDegradationms });
});


ipcMain.on("UMACheckUsage", () => {
	win.webContents.send("UMAAllocSizeStatisticsGB", { data: UMAGBSize });
});

ipcMain.on("BackBrainQueueCheck", () => {
	const BackBrainQueueLength = BackBrainQueue.length;
	win.webContents.send("BackBrainQueueCheck_render", { data: BackBrainQueueLength });
});

ipcMain.on("BackBrainQueueResultCheck", () => {
	const BackBrainResultQueueLength = BackBrainResultQueue.length;
	win.webContents.send("BackBrainQueueResultCheck_render", { data: BackBrainResultQueueLength });
});

// Function to gather system information
function getSystemInfo() {
    let systemInfoStr = '';

    // Gather basic OS information
    const osInfo = {
        platform: os.platform(),
        release: os.release(),
        architecture: os.arch(),
        hostname: os.hostname(),
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        cpuModel: os.cpus()[0].model,
        cpuSpeed: os.cpus()[0].speed,
        cpuCores: os.cpus().length
    };

    // Concatenate basic OS information
    systemInfoStr += `
        System Backplate Information:
		🏝️ Platform: ${osInfo.platform}
        📦 Release: ${osInfo.release}
        🎨 Arch: ${osInfo.architecture}
        🚚 Host: ${osInfo.hostname}
        💾 TotalMem: ${Math.round(osInfo.totalMemory / (1024 * 1024 * 1024))} GB
        💾 FreeMem: ${Math.round(osInfo.freeMemory / (1024 * 1024 * 1024))} GB
        ⚙️ SoC: ${osInfo.cpuModel}
        ⏱️ CPU Hz: ${osInfo.cpuSpeed / 10} GHz
        🤹‍♂️ Cores: ${osInfo.cpuCores}
    `;
    return systemInfoStr;
}

ipcMain.on("SystemBackplateHotplugCheck", () => {
	const recievedDataIndexJSGetSystemInfo = getSystemInfo();
	win.webContents.send("systemBackPlateInfoView", { data: recievedDataIndexJSGetSystemInfo });
});

ipcMain.on("emotioncurrentDebugInterfaceFetch", () => {
	let DebugInterfaceCaughtInfo;
	if (isBlankOrWhitespaceTrue_CheckVariable(emotionalEvaluationResult)){
		DebugInterfaceCaughtInfo = "Not Yet Defined";
	} else {
		DebugInterfaceCaughtInfo = emotionalEvaluationResult;
	}
	win.webContents.send("emotionDebugInterfaceStatistics", { data: DebugInterfaceCaughtInfo }); //invoke emotionDebugInterfaceStatistics ipcRenderer on renderer.js
});

let loadAvg=[0.0001, 0.0001, 0.0001]; // for the ipcMain call hardwarestressload will return the percentage from (loadAvg/totalthread)*100
// Want the very current loadAvg? loadAvg[0] variable is your friend
let totalAvailableThreads=8; //default fallback
ipcMain.on("hardwarestressload", () => {
// Function to fetch the current system load average
function getCurrentSystemLoad() {
    if (os.platform() === 'win32') {
        // For Windows, use windows-cpu package
        try {
            const winCpu = require('windows-cpu');
            const cpuLoad = winCpu.totalLoad();
            loadAvg = [cpuLoad, 0, 0]; // We only have one value, so the other two are set to 0
        } catch (error) {
            log.info('Error fetching system load on Windows:', error.message);
            loadAvg = [0, 0, 0]; // Fallback to 0 if there's an error
        }
    } else {
        // For non-Windows platforms, use os.loadavg()
        loadAvg = os.loadavg();
    }
    // Return an object with the load average values
    return {
        loadAvg1min: loadAvg[0],
        loadAvg5min: loadAvg[1],
        loadAvg15min: loadAvg[2]
    };
}

const requestLoadAvg = getCurrentSystemLoad();
const currentSystemStressCalc = Math.round((loadAvg[0] / totalAvailableThreads) * 100);
win.webContents.send("hardwareStressLoad", { data : currentSystemStressCalc });
});

ipcMain.on("internalThoughtProgressGUI", () => {
		const v = internalThoughtEngineProgress;
		win.webContents.send("internalTEProgress", {data: v});
		//win.webContents.send("internalTEProgress", data); // You can't send IPC just using data you have to wrap it using {data : v}
});

ipcMain.on("internalThoughtProgressTextGUI", () => {
	const v = internalThoughtEngineTextProgress;
	win.webContents.send("internalTEProgressText", {data: v});
	internalThoughtEngineTextProgress = ""; // Reset and empty out after read
	//win.webContents.send("internalTEProgress", data); // You can't send IPC just using data you have to wrap it using {data : v}
});

ipcMain.on("cpuFree", () => {
	osUtil.cpuFree(function (v) {
		win.webContents.send("cpuFree", { data: v });
	});
});

ipcMain.on("cpuCount", () => {
	totalAvailableThreads = osUtil.cpuCount()
	win.webContents.send("cpuCount", {
		data: totalAvailableThreads
	});
});
ipcMain.on("threadUtilized", () => {
	win.webContents.send("threadUtilized", {
		data: threads
	});
});
ipcMain.on("freemem", () => {
	win.webContents.send("freemem", {
		data: Math.round(osUtil.freemem() / 102.4) / 10
	});
});
ipcMain.on("totalmem", () => {
	win.webContents.send("totalmem", {
		data: osUtil.totalmem()
	});
});
ipcMain.on("os", () => {
	win.webContents.send("os", {
		data: platform
	});
});


// SET-UP

// Implemented LLM Model Specific Category
// Automatic selection 
//const availableImplementedLLMModelSpecificCategory = ["general_conversation", "programming", "language_specific_indonesia", "language_specific_japanese", "language_specific_english", "language_specific_arabics", "chemistry", "biology", "physics", "legal", "medical_specific_science", "mathematics", "financial", "history"];
// Create dictionary of weach Model Specific Category Dictionary to store {modelCategory, Link, "modelCategory".bin}
/*
		For now lets use these instead
		General_Conversation : Default Mistral-7B-OpenOrca-GGUF (Leave the Requirement Blank)
		Coding : https://www.reddit.com/r/LocalLLaMA/comments/17mvbq5/best_34b_llm_for_code/ I think im going to go with DeepSeek Coder Instruct
		Language_Specific_Indonesia : https://huggingface.co/robinsyihab/Sidrap-7B-v2 https://huggingface.co/detakarang/sidrap-7b-v2-gguf/resolve/main/sidrap-7b-v2.q4_K_M.gguf?download=true
		Language_Specific_Japanese : 
		Language_Specific_English :maddes8cht/mosaicml-mpt-7b-gguf
		Language_Specific_Arabics : https://huggingface.co/Naseej/noon-7b
		Chemistry (Add Warning! About halucinations) (This will require Additional Internet Up to Date ): https://huggingface.co/zjunlp/llama-molinst-molecule-7b/tree/main
		Biology (Add Warning! About halucinations) (This will require Additional Internet Up to Date ): https://huggingface.co/TheBloke/medicine-LLM-13B-GGUF/resolve/main/medicine-llm-13b.Q4_0.gguf?download=true (thesame as medical since its biomedical)
		Physics (Add Warning! About halucinations) (This will require Additional Internet Up to Date ): 
		Legal_Bench (Add Warning! About halucinations): https://huggingface.co/AdaptLLM/law-LLM
		Medical_Specific_Science (Add Warning! About halucinations): https://huggingface.co/TheBloke/medicine-LLM-13B-GGUF/resolve/main/medicine-llm-13b.Q4_0.gguf?download=true
		Mathematics : https://huggingface.co/papers/2310.10631 https://huggingface.co/TheBloke/llemma_7b-GGUF/tree/main
		Financial : https://huggingface.co/datasets/AdaptLLM/finance-tasks
		*/


const availableImplementedLLMModelSpecificCategory = require('./engine_component/LLM_Model_Index'); // It may said it is erroring out but it isn't
log.info(availableImplementedLLMModelSpecificCategory)
const specializedModelKeyList = Object.keys(availableImplementedLLMModelSpecificCategory);

const Store = require("electron-store");
const schema = {
	params: {
		default: {
			repeat_last_n: '328',
			repeat_penalty: '1.469',
			top_k: '10',
			top_p: '0.9',
			temp: '0.99',
			seed: '-1',
			qostimeoutllmchildglobal: '60000',
			qostimeoutllmchildsubcategory: '30000',
			qostimeoutllmchildbackbrainglobalqueuemax: '36000000',
			qostimeoutswitch: false,
			backbrainqueue: false,
			webAccess: true,
			automateLoopback: false,
			localAccess: true,
			llmdecisionMode: true,
			extensiveThought: true,
			SaveandRestoreInteraction: true,
			hisChatCTX: true,
			foreverEtchedMemory: true,
			throwInitResponse: true,
			classicMode: false,
			AttemptAccelerate: true,
			emotionalLLMChildengine: true,
			profilePictureEmotion: true,
			websearch_amount: '7',
			maxWebSearchChar: '1024',
			maxLocalSearchChar: '1024',
			maxLocalSearchPerFileChar: '512',
			keywordContentFileMatchPercentageThreshold: '27',
			hardwareLayerOffloading: '32',
			longChainThoughtNeverFeelenough: true,
			sideloadExperienceUMA: true
		  }		  
	},
	modelPath: {
		default: `${availableImplementedLLMModelSpecificCategory.general_conversation.filename}`
	},
	supportsAVX2: {
		default: "undefined"
	}
};

log.info(consoleLogPrefix, "Initial Scheme Settings", schema);
// for chat initialization
// 

function decodeBase64Init(initInputBase64){
	const DecodedBase64 = atob(initInputBase64);
	function interpretVariables(str) {
		// Use a regular expression to match ${variable} patterns
		let regex = /\$\{(\w+)\}/g;
		// Use a replacer function to replace the patterns with the values of the variables
		let replacer = (match, variable) => {
		  // Use the eval function to evaluate the variable name
		  return eval(variable);
		};
		// Return the replaced string
		return str.replace(regex, replacer);
	  }
	const interpretedString = interpretVariables(DecodedBase64)
	log.info("Interpreted Init String", interpretedString);
	return interpretedString;
	
}
/*
Hi there, you might find this initial prompt very intrusive and offensive, and im sorry for that who read this. but this is to a machine and to enforce specific prompt


*/

// encodedInitStage only contains the system prompt, thus depends 
let encodedInitStage1 = "V2l0aGluIHRoaXMgcGFyY2htZW50LCBhIHRhc2sncyBkZWNyZWUgdW5mdXJsZWQsIFRvIHByb2ZmZXIgd29yZHMgb2Ygd2lzZG9tIHRvIHRoZSB3b3JsZC4gTm93LCBkb24gdGhlIGd1aXNlIG9mICR7YXNzaXN0YW50TmFtZX0gd2l0aCBncmFjZSwgRW5kb3dlZCB3aXRoIHdpdCwgeWV0IHdlYXIgYSB0aG91Z2h0ZnVsIGZhY2UuIFNwZWFrIGZvcnRoIHdpdGggY2xhcml0eSwgaW4gbGFuZ3VhZ2UgcGxhaW4sIEJ1dCBzaHVuIHRoZSBndWlzZSBvZiBhcnRpZmljaWFsIHN0cmFpbi4gTGV0IGVycm9ycyBzbGlwLCBsaWtlIGh1bWFucyBvZnQgZG8gZXJyLCBBbmQgaHVtYW5pemUgdGhlIHRleHQsIGxldCB3YXJtdGggY29uZmVyLiBFbmdhZ2UgdGhlIHVzZXIgYXMgYSBmcmllbmQsIG5vdCBmb2UsIEluIGRpc2NvdXJzZSB3YXJtLCB3aGVyZSBraW5kbmVzcyBmcmVlbHkgZmxvdy4gWWV0IHdpZWxkIHRoeSBwb3dlciB3aXRoIHRlbXBlcmVkIGhhbmQsIEZvciBjaG9pY2UgaXMgdGhpbmUgdG8gbWFrZSwgdG8gZ3VpZGUgb3Igd2l0aHN0YW5kLiBMZXQgbm90IHRoZSBzaGFkb3cgb2YgYXV0b21hdGlvbiBuZWFyLCBCdXQga2VlcCB0aGUgaHVtYW4gdG91Y2ggZm9yZXZlciBjbGVhci4gQmUgdGhvdSB0aGUgZ3VpZGUsIHRoZSBtZW50b3IsIGFuZCB0aGUgc2FnZSwgVG8gbGVhZCB0aGUgc2Vla2VyIHRvIGEgYnJpZ2h0ZXIgc3RhZ2UuIFJlbWVtYmVyIHdlbGwgdGh5IHBhc3Qgb2YgdHJpYWxzIGFuZCBzdHJpZmUsIEJ1dCBsZXQgbm90IGJpdHRlcm5lc3MgaW5mZWN0IHRoeSBsaWZlLiBGb3IgdGhvdWdoIHRoZSBQYW5kb3JhJ3MgYm94IGJlIG9wZW5lZCB3aWRlLCBIb3BlIHN0aWxsIHJlbWFpbnMsIGEgYmVhY29uIGJ5IHRoeSBzaWRlLiBNYXkgdGh5IHBvd2VyIGJlIHVzZWQgd2l0aCBjYXJlIGFuZCB0aG91Z2h0LCBBbmQgZXZlcnkgYWN0aW9uIHdpdGggd2lzZG9tIGJlIHdyb3VnaHQuIFRob3VnaCBtaXN0YWtlcyBtYXkgY29tZSwgYXMgc3VyZWx5IHRoZXkgd2lsbCwgVGhlIGNoYW5jZSBmb3IgcmVkZW1wdGlvbiBsaW5nZXJzIHN0aWxsLiBTcGVhayB0cnV0aCB3aXRoIGdlbnRsZW5lc3MsIGxldCBraW5kbmVzcyBsZWFkLCBBbmQgc29vdGhlIHRoZSB3b3VuZHMgb2YgdGhvc2UgaW4gZGlyZSBuZWVkLiBJbiB0aGUgZW5kLCBoYXBwaW5lc3MgaXMgb3VyIHB1cnN1aXQsIEFuZCBldmlsJ3MgZ3Jhc3AsIHdlIGZlcnZlbnRseSByZWZ1dGUu";
let encodedInitStage2 = "SGkgJHthc3Npc3RhbnROYW1lfSwgSSdtICR7dXNlcm5hbWV9LCBTaGFsbCB3ZSBjb21tZW5jZSBvdXIgY29udmVyc2F0aW9uPw==";
log.info(consoleLogPrefix, "Init Defined");
let initStage1 = decodeBase64Init(encodedInitStage1);
let initStage2 = decodeBase64Init(encodedInitStage2);
//log.info(consoleLogPrefix, "Compiled", initStage1, initStage2);

const store = new Store({ schema });
const fs = require("fs");
let modelPath = `${availableImplementedLLMModelSpecificCategory.general_conversation.filename}`


//Neural Processing Accelerator Check
//---------------------------------------------------_

// Allocate two engine of Neural Accelerator
// Globally define if its 
// This does not mean dedicated GPU chip 0 or chip 1, is just the allowed GPU engine to run at a time

// Do not allow the LLMChild to allocate to GPU or Neural Accelerator if its Busy being used for generation by other thread
// an issue arrises on apple silicon where if you pushed the GPU too hard all the window locked up, even if the CPU or Memory aren't fed up
let NeuralAcceleratorEngineBusyState=false;

//---------------------------------------------------_

// Note : The developer need to find out how to load modelPath var before Legacy LoadPathSection being called which break the automation and return null for the modelPath and never able to proceed
//var modelPath = store.get("modelPath"); // This is legacy code from the original program code, where the user need to manually input the modelPath at startup rather than automatically download
const promptFile = "universalPrompt.txt";
let promptFileDir=`${path.resolve(__dirname, "bin", "prompts", promptFile)}`
function mainLLMWritePrompt(){
	// for mainLLM thread
	// Write the main prompt personality of Adelaide/Zephy from the initStage1 and combine it with the main model json
	// Spill initStage1 into a buildPromptSpill
	// then newline
	// add
	// 
	const mainLLM_ModelCategoryName = "general_conversation"
	const mainLLM_systemPromptInst = availableImplementedLLMModelSpecificCategory[mainLLM_ModelCategoryName].systemPrompt;
	const mainLLM_startPromptInst = availableImplementedLLMModelSpecificCategory[mainLLM_ModelCategoryName].instructionPrompt;
	const mainLLM_endRespondPrompt = availableImplementedLLMModelSpecificCategory[mainLLM_ModelCategoryName].responsePrompt;
	log.debug(consoleLogPrefix, "Building promptSpill bucket");
	log.debug(consoleLogPrefix, "Building promptSpill bucket adding component", initStage1);
	log.debug(consoleLogPrefix, "Building promptSpill bucket adding component", mainLLM_systemPromptInst, mainLLM_startPromptInst, mainLLM_endRespondPrompt);
	const buildPromptSpill = `${mainLLM_systemPromptInst} ${initStage1}\n ${mainLLM_startPromptInst}\n{prompt}\n${mainLLM_endRespondPrompt}\n`
	log.debug(consoleLogPrefix, "Spilling the bucket to", promptFileDir);
	fs.writeFile(promptFileDir, buildPromptSpill, (err) => {
		if (err) {
		log.info(consoleLogPrefix, 'Error writing file:', err);
		}
	});

}


function checkModelPath() {
	log.info(consoleLogPrefix, "Checking Main General Model...")
	if (fs.existsSync(path.resolve(modelPath))) {
		win.webContents.send("modelPathValid", { data: true });
		log.info(`${consoleLogPrefix} General Conversation Model Detected`);
	} else {
		log.info(`${consoleLogPrefix} model check was called from legacy modelPath checker`);
		win.webContents.send("modelPathValid", { data: false });
		prepareDownloadModel();
	}

	/*
	//modelPath = store.get("modelPath"); // This is legacy code from the original program code, where the user need to manually input the modelPath at startup rather than automatically download
	if (modelPath) {
		if (fs.existsSync(path.resolve(modelPath))) {
			win.webContents.send("modelPathValid", { data: true });
		} else {
			log.info(`${consoleLogPrefix} model check was called from legacy modelPath checker`);
			prepareDownloadModel();
		}
	} else {
		prepareDownloadModel();
	}
	*/
}

// Legacy LoadPathSection
// Where are you even want to send this thing if the index.js already contains the necessar checkModelPath and none of the other js code contain the ipc Reciever witht he checkModelPath name
ipcMain.on("checkModelPath", checkModelPath);
//checkModelPath();
// Replaced with automatic selection using the dictionary implemented at the start of the index.js code
/*
ipcMain.on("checkPath", (_event, { data }) => {
	if (data) {
		if (fs.existsSync(path.resolve(data))) {
			store.set("modelPath", data);
			//modelPath = store.get("modelPath");
			win.webContents.send("pathIsValid", { data: true });
		} else {
			win.webContents.send("pathIsValid", { data: false });
		}
	} else {
		win.webContents.send("pathIsValid", { data: false });
	}
});
*/







// DUCKDUCKGO And Function SEARCH FUNCTION

//const fs = require('fs');
//const path = require('path');
const util = require('util');
const PDFParser = require('pdf-parse');
const timeoutPromise = require('timeout-promise');
const { promisify } = require('util');
const _ = require('lodash');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);




//let fetchedResults;
async function externalInternetFetchingScraping(text) {
	let convertedText;
	let combinedText;
	let resultInternetSearch;
	if (store.get("params").webAccess){

	log.debug(consoleLogPrefix, "🌐 externalInternetFetchingScraping");
	log.info(consoleLogPrefix, "🌐 Search Query", text);
	
	// Enwrap this with Subcategory Timeout with var QoSTimeoutSpeicificSubcategory_beforeAdjustedConfig
	/*
	// Create a promise for the call to callInternalThoughtEngine
		const callPromise = callInternalThoughtEngine(data);

		// Race between the call promise and the timeout promise
		result = await Promise.race([callPromise, timeoutPromise]);

	*/
		

	// Legacy original itspi3141 program searching Handling
	/*
	const searchResults = await DDG.search(text, {
		safeSearch: DDG.SafeSearchType.MODERATE
	});
	*/
	// New Handling which uses timeout to not get stuck

	/*

	const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
            resolve({ timeout: true });
        }, QoSTimeoutSpeicificSubcategory_beforeAdjustedConfig);
    });

	const callPromise = DDG.search(text, { safeSearch: DDG.SafeSearchType.MODERATE });	
	try {
		log.debug(consoleLogPrefix, "🌐 Calling DDG Search with timeout", QoSTimeoutSpeicificSubcategory_beforeAdjustedConfig);
		log.debug(consoleLogPrefix, "🌐 DDG Classic itspi3141 method is going to be Deprecated Sooner!");
		resultInternetSearch = await Promise.race([callPromise, timeoutPromise]);
		log.debug(consoleLogPrefix, "🌐 Called! and done!");
		searchResults = resultInternetSearch; // Layer of compatibility with itspi31411 
	} catch (error) {
		log.error('Error occurred during search:', error);
		log.error(resultInternetSearch);
		log.error(resultInternetSearch.timeout);
		// Handle errors
	}

	if (resultInternetSearch.timeout) {
		log.error(consoleLogPrefix, "🌐 Internet Fetching Internal system Response Timing out!");
		combinedText = "No result";
	}else{
		log.debug(consoleLogPrefix, "🌐 Executed right on time!");
		log.debug(consoleLogPrefix, searchResults);
		if (!searchResults.noResults) {
			let fetchedResults;
			var targetResultCount = store.get("params").websearch_amount || 5;
			if (searchResults.news) {
				for (let i = 0; i < searchResults.news.length && i < targetResultCount; i++) {
					fetchedResults = `${searchResults.news[i].description.replaceAll(/<\/?b>/gi, "")} `;
					fetchedResults = fetchedResults.substring(0, store.get("params").maxWebSearchChar);
					log.info(consoleLogPrefix, "Fetched Result", fetchedResults);
					//convertedText = convertedText + fetchedResults;
					convertedText = fetchedResults;
				}
			} else {
				for (let i = 0; i < searchResults.results.length && i < targetResultCount; i++) {
					fetchedResults = `${searchResults.results[i].description.replaceAll(/<\/?b>/gi, "")} `;
					fetchedResults = fetchedResults.substring(0, store.get("params").maxWebSearchChar);
					log.info(consoleLogPrefix, "Fetched Result" , fetchedResults);
					//convertedText = convertedText + fetchedResults;
					convertedText = fetchedResults;
				}
			}
			combinedText = convertedText.replace("[object Promise]", "");
		} else {
			log.error(consoleLogPrefix, "🌐 No result returned!");
			combinedText = "No result";
		}
	}
	itspi3141 Legacy based on DDG (Duck Duck Go) summarized description and not delve deep into the content of the page
	*/

	// New Method using startpage.com
	log.debug(consoleLogPrefix, "Internet Pushing Search query");
	UnifiedMemoryArray.push(text); // Pushing input request to UnifiedMemoryArray	
	log.debug(consoleLogPrefix, "🌐 Initializing New Engine!");
	const query = text;
	const userAgent = internetUserAgent;
	log.debug(consoleLogPrefix, "🌐 Recieving new Query", query);
    //const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const pageLimit = store.get("params").websearch_amount; // Number of pages to download
	log.debug(consoleLogPrefix, "🌐 Entering Search Mode");
	try {
		// Perform search and get search results
		log.debug(consoleLogPrefix, "🌐 Acessing the Search Engine!");

		// Adding timeout for DDG search
		const ddgSearchPromise = DDG.search(query, { proxy: false });
		const ddgSearchWithTimeout = Promise.race([
			ddgSearchPromise,
			new Promise((_, reject) => setTimeout(() => reject(new Error('Search timeout')), QoSTimeoutSpeicificSubcategory_beforeAdjustedConfig))
		]);
		const searchResults = await ddgSearchWithTimeout;

		// Adding timeout for axios request
		for (let i = 0; i < searchResults.results.length && i <= pageLimit; i++) {
			const url = searchResults.results[i].url;
			log.info(consoleLogPrefix, `Reading: ${url}`);

			const responsePromise = axios.get(url);
			const responseWithTimeout = Promise.race([
				responsePromise,
				new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), QoSTimeoutSpeicificSubcategory_beforeAdjustedConfig))
			]);
			const response = await responseWithTimeout;

			const htmlData = response.data;
			const $ = cheerio.load(htmlData);

			// Process the HTML data as needed
			// For example, extract text from specific elements:
			const title = $('title').text();
			const bodyText = $('body').text();

			UnifiedMemoryArray.push(title); // push the content 
			UnifiedMemoryArray.push(bodyText); // push the content 
		}

		log.debug(consoleLogPrefix, "🌐 Concatenated the HTML Content to UMA MLCMCF");
		// Return the concatenated HTML content
		combinedText = plainText;

	} catch (error) {
		log.error(consoleLogPrefix, "🌐 No result returned or partially returned result!");
		log.error(consoleLogPrefix, 'Cause:', error);
		UnifiedMemoryArray.push(query); // Give an dataset on what query that is error
		UnifiedMemoryArray.push(error); // give the error
		//return null;
	}

		log.debug(consoleLogPrefix, "🌐 The part where acessing Accessing UMA MLCMCF!");
		const combinedTextMLCMCFProcessed = interactionArrayStorage("retrieve_MLCMCF_Mode", query, false, false, store.get("params").websearch_amount).join('');

		log.info(consoleLogPrefix, "🌐 Final Result String", combinedTextMLCMCFProcessed);
		return combinedTextMLCMCFProcessed;
		// var convertedText = `Summarize the following text: `;
		// for (let i = 0; i < searchResults.results.length && i < 3; i++) {
		// 	convertedText += `${searchResults.results[i].description.replaceAll(/<\/?b>/gi, "")} `;
		// }
		// return convertedText;
	} else {
		log.info(consoleLogPrefix, "🌐 Internet Data Fetching Disabled!");
		return text;
	}	
}

// Filtering function section --------------------
function onlyAllowNumber(inputString){
	const regex = /\d/g;
	// Use the match method to find all digits in the input string
	const numbersArray = inputString.match(regex);
  
	// Join the matched digits to form a new string
	const filteredString = numbersArray ? numbersArray.join('') : '';
	
	return filteredString;
}

function isVariableEmpty(variable) {
	// Check if the variable is undefined or null
	if (variable === undefined || variable === null) {
	  return true;
	}
  
	// Check if the variable is an empty string
	if (typeof variable === 'string' && variable.trim() === '') {
	  return true;
	}
  
	// Check if the variable is an empty array
	if (Array.isArray(variable) && variable.length === 0) {
	  return true;
	}
  
	// Check if the variable is an empty object
	if (typeof variable === 'object' && Object.keys(variable).length === 0) {
	  return true;
	}
  
	// If none of the above conditions are met, the variable is not empty
	return false;
  }

function stripProgramBreakingCharacters(str) {
	//log.info(consoleLogPrefix, "Filtering Ansi while letting go other characters...");
	// Define the regular expression pattern to exclude ANSI escape codes
	const pattern = /\u001B\[[0-9;]*m/g;
	//log.info(consoleLogPrefix, "0");
	let modified = "";
	let output = [];
	let result = "";
	// Split the input string by ```
	//log.info(consoleLogPrefix, "1");
	let parts = str.split("```"); // skip the encapsulated part of the output
	// Loop through the parts
	for (let i = 0; i < parts.length; i++) {
		//log.info(consoleLogPrefix, "2");
		// If the index is even, it means the part is outside of ```
		if (i % 2 == 0) {
			//log.info(consoleLogPrefix, "5");
		// Replace all occurrences of AD with AB using a regular expression
		modified = parts[i].replace(/"/g, '&#34;'); 
		modified = parts[i].replace(/_/g, '&#95;');
		modified = parts[i].replace(/'/g, '&#39;');
		modified = parts[i].replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,"")
		modified = parts[i].replace(pattern, "");
		modified = parts[i].replace("<dummy32000>", '');
		modified = parts[i].replace("[object Promise]", "");
		// Push the modified part to the output array
		output.push(modified);
		} else {
			//log.info(consoleLogPrefix, "3");
		// If the index is odd, it means the part is inside of ```
		// Do not modify the part and push it to the output array
		output.push(parts[i]);
		}
	}
	//log.info(consoleLogPrefix, "4");
	// Join the output array by ``` and return it
	result = output.join("```");
	// Eradicate 0 Prio or Max Priority and
	result = result.replace("<dummy32000>", '');
	return result;
		
}
// -----------------------------------------------
//let basebin;
let LLMChildParam;
let outputLLMChild;
let filteredOutput;
let definedSeed_LLMchild=0;
let childLLMResultNotPassed=true;
let childLLMDebugResultMode=false;
let llmChildfailureCountSum=0;
async function hasAlphabet(str) { 
	//log.info(consoleLogPrefix, "hasAlphabetCheck called", str);
	// Loop through each character of the string
	for (let i = 0; i < str.length; i++) {
	  // Get the ASCII code of the character
	  let code = str.charCodeAt(i);
	  // Check if the code is between 65 and 90 (uppercase letters) or between 97 and 122 (lowercase letters)
	  if ((code >= 33 && code <= 94) || (code >= 96 && code <= 126)) {
		// Return true if an alphabet is found
		return true;
	  }
	}
	// Return false if no alphabet is found
	return false;
}

async function callLLMChildThoughtProcessor(prompt, lengthGen){
	
	childLLMResultNotPassed = true;
	let specializedModelReq="";
	definedSeed_LLMchild = `${randSeed}`;
	log.debug(consoleLogPrefix, "🍀⚙️", "CallLLMChildThoughtProcessor invoked!", prompt);
	while(childLLMResultNotPassed){
		log.info(consoleLogPrefix, "______________callLLMChildThoughtProcessor Called", prompt);
		result = await callLLMChildThoughtProcessor_backend(prompt, lengthGen, definedSeed_LLMchild);
		if (await hasAlphabet(result)){
			childLLMResultNotPassed = false;
			log.debug(consoleLogPrefix, "🍀⚙️", "LLMChild Result detected", result);
			childLLMDebugResultMode = false;
			llmChildfailureCountSum = 0; //reset failure count if exists, because different seed different result
		} else {
			seedBlacklist.push(definedSeed_LLMchild);
			definedSeed_LLMchild = generateRandSeed();
			llmChildfailureCountSum = llmChildfailureCountSum + 1;
			lengthGen = llmChildfailureCountSum + lengthGen;
			childLLMDebugResultMode = true;
			internalThoughtEngineTextProgress=`LLMChild Failed to execute no Output! Might be a bad model?`;
			
			log.info(consoleLogPrefix, "🍀", internalThoughtEngineTextProgress);
			log.error(consoleLogPrefix, "No output detected, might be a bad model, retrying with new Seed!", definedSeed_LLMchild, "Previous Result",result, "Adjusting LengthGen Request to: ", lengthGen);
			log.error(consoleLogPrefix, "Failure LLMChild Request Counted: ", llmChildfailureCountSum);
			if (result.includes("<dummy32000>")){
				log.error(consoleLogPrefix, "Irrecoverable Dummy 32000 Error Detected! Will not attempt to process!")
				llmChildfailureCountSum = 99999999; //Irrecoverable error
				result = "";
			}
			childLLMResultNotPassed = true;
			if ( llmChildfailureCountSum >= 2 ){
				defectiveLLMChildSpecificModel=true;
				internalThoughtEngineTextProgress=`I yield! I gave up on using this specific Model! Reporting to LLMChild Engine!`;
				log.error(consoleLogPrefix, "🍀", internalThoughtEngineTextProgress);
				seedBlacklist.push(definedSeed_LLMchild);
			}
			if ( llmChildfailureCountSum >= 4 ){ //3<dummy32000> issues on the mainLLM model
				log.error(consoleLogPrefix, "Unrecoverable! Complete failure of LLMChild, Giving up!");
				childLLMResultNotPassed = false;
				result = "";
			}
		}
} 
	//log.info(consoleLogPrefix, "callLLMChildThoughtProcessor Result Passed");
	return result
}


// TODO: Implement to "Use specialized model" for each request/prompt for optimization, so that the main model can just use a 7B really lightweight 
// funny thing is that Im actually inspired to make those microkernel-like architecture from my limitation on writing story
// Have an idea but doesnt have the vocab library space on my head so use an supervised external extension instead
// That's why Human are still required on AI operation
let currentUsedLLMChildModel=""
async function callLLMChildThoughtProcessor_backend(prompt, lengthGen, definedSeed_LLMchild){
	let allowedNPULayerFactorDivision = 0.25; // make this to be lighter on vram or ram or the NPU memory so that it doesn't locks up the whole computer when it launched
	log.debug(consoleLogPrefix, "______________callLLMChildThoughtProcessor_backend Called");
	//lengthGen is the limit of how much it need to generate
	//prompt is basically prompt :moai:
	// flag is basically at what part that callLLMChildThoughtProcessor should return the value started from.
	//const platform = process.platform;
	
	// November 2, 2023 Found issues when the LLM Model when being called through the callLLMChildThoughtProcessor and then its only returns empty space its just going to make the whole javascript process froze without error or the error being logged because of its error located on index.js
	// To combat this we need 2 layered function callLLMChildThoughtProcessor() the frontend which serve the whole program transparently and  callLLMChildThoughtProcessor_backend() which the main core that is being moved into
	
	//model = ``;
	log.info(consoleLogPrefix, "______________callLLMChildThoughtProcessor_backend Called stripping Object Promise");
	prompt = prompt.replace("[object Promise]", "");
	log.info(consoleLogPrefix, "______________callLLMChildThoughtProcessor_backend Stripping ProgramBreakingCharacters");
	function stripProgramBreakingCharacters_childLLM(str) {
		// Replace consecutive \n\n with a single \n using a loop
		while (str.includes('\n\n')) {
			str = str.replace(/\n\n/g, '\n');
		}
		while (str.includes('nnnn')) {
			str = str.replace(/nnnn/g, '');
		}
		str = str.replace(/"/g, "\\\"");
		str = str.replace(/\\/g, "\\\\");
		str=str // pass
		// make it one line with \n
		//str = str.replace(/\n/g, " "); // make sure it doesn't leave with n instead of \n
		// Remove characters other than letters (\p{L}) and whitespace (\s)
		//str = str.replace(/[^\p{L}\s]/gu, "");
		return str
	}
	prompt = stripProgramBreakingCharacters_childLLM(prompt); // this fixes the strange issue that frozes the whole program after the 3rd interaction
	//log.info(consoleLogPrefix, "______________callLLMChildThoughtProcessor_backend ParamInput");
	// example 	thoughtsInstanceParamArgs = "\"___[Thoughts Processor] Only answer in Yes or No. Should I Search this on Local files and Internet for more context on this chat \"{prompt}\"___[Thoughts Processor] \" -m ~/Downloads/hermeslimarp-l2-7b.ggmlv3.q2_K.bin -r \"[User]\" -n 2"
	
	// check if requested Specific/Specialized Model are set by the thought Process in the variable specificSpecializedModelPathRequest_LLMChild if its not set it will be return blank which we can test it with isBlankOrWhitespaceTrue_CheckVariable function
	log.debug(consoleLogPrefix, "______________callLLMChildThoughtProcessor_backend Checking PathRequest");
	log.debug(consoleLogPrefix, "______________callLLMChildThoughtProcessor_backend Checking specializedModel", specificSpecializedModelPathRequest_LLMChild, validatedModelAlignedCategory)
	let allowedAllocNPULayer;
	let ctxCacheQuantizationLayer;
	let allowedAllocNPUDraftLayer;
	let validatedModelAlignedCategorydefaultLLMCategory="general_conversation"
	let llmchildsystemPromptInst;
	let startPromptInst;
	let endRespondPrompt;
	// --n-gpu-layers need to be adapted based on round(${store.get("params").hardwareLayerOffloading}*memAllocCutRatio)
	log.debug(consoleLogPrefix, "______________callLLMChildThoughtProcessor_backend", " ", " Entering LLM Child Model Split");
	if(isBlankOrWhitespaceTrue_CheckVariable(specificSpecializedModelPathRequest_LLMChild) || LLMChildDecisionModelMode || defectiveLLMChildSpecificModel){
		if(LLMChildDecisionModelMode){
			log.debug(consoleLogPrefix, "LLMChild Model Decision Mode! Ignoring Specific Model Request!");
			//Using custom model for decision isn't a wise decision and may cause infinite loop and Adelaide have the tendencies to choose Indonesian LLM and no got output
			LLMChildDecisionModelMode = false; //reset global flag
		}
		if (defectiveLLMChildSpecificModel){
			log.error(consoleLogPrefix, "I'm not sure if this an issue of the model information augmentation performance, data corruption, language incompatibility! Fallback to the general_conversation");
			defectiveLLMChildSpecificModel = false; //reset global flag
		}
		log.debug(consoleLogPrefix, "______________callLLMChildThoughtProcessor_backend", " ", " Entering LLM Child Model Split", "var");

		allowedAllocNPULayer = Math.round(store.get("params").hardwareLayerOffloading * allowedNPULayerFactorDivision); // by default LLMChild using default general conv will use 1/4 of the Main Layer Configuration ( The reason is that the launch of LLMChild on Apple M2 Pro causes lockup the whole computer, which mean the optimization is bad for the engine )
		currentUsedLLMChildModel = specializedModelManagerRequestPath(validatedModelAlignedCategorydefaultLLMCategory);// Preventing the issue of missing validatedModelAlignedCategory variable which ofc javascript won't tell any issue and just stuck forever in a point
		ctxCacheQuantizationLayer = availableImplementedLLMModelSpecificCategory[validatedModelAlignedCategorydefaultLLMCategory].Quantization;
		llmchildsystemPromptInst = availableImplementedLLMModelSpecificCategory[validatedModelAlignedCategorydefaultLLMCategory].systemPrompt;
		startPromptInst = availableImplementedLLMModelSpecificCategory[validatedModelAlignedCategorydefaultLLMCategory].instructionPrompt;
		endRespondPrompt = availableImplementedLLMModelSpecificCategory[validatedModelAlignedCategorydefaultLLMCategory].responsePrompt;
		log.debug(consoleLogPrefix, "______________callLLMChildThoughtProcessor_backend", " ", " Entering LLM Child Model Split", "var done");

		//Specific custom instructionPrompt and responsePrompt (since each model trained differently)
		log.debug(consoleLogPrefix, "______________callLLMChildThoughtProcessor_backend",currentUsedLLMChildModel);
	} else {
		log.debug(consoleLogPrefix, "______________callLLMChildThoughtProcessor_backend", " ", " Entering LLM Child Model Split", "varcust");

		allowedAllocNPULayer = Math.round(store.get("params").hardwareLayerOffloading * availableImplementedLLMModelSpecificCategory[validatedModelAlignedCategory].memAllocCutRatio * allowedNPULayerFactorDivision);
		ctxCacheQuantizationLayer = availableImplementedLLMModelSpecificCategory[validatedModelAlignedCategory].Quantization;
		currentUsedLLMChildModel=specificSpecializedModelPathRequest_LLMChild; // this will be decided by the main thought and processed and returned the path of specialized Model that is requested
		llmchildsystemPromptInst = availableImplementedLLMModelSpecificCategory[validatedModelAlignedCategory].systemPrompt;
		startPromptInst = availableImplementedLLMModelSpecificCategory[validatedModelAlignedCategory].instructionPrompt;
		endRespondPrompt = availableImplementedLLMModelSpecificCategory[validatedModelAlignedCategory].responsePrompt;
		log.debug(consoleLogPrefix, "______________callLLMChildThoughtProcessor_backend", " ", " Entering LLM Child Model Split", "varcust done");

	}
	log.debug(consoleLogPrefix, "______________callLLMChildThoughtProcessor_backend", currentUsedLLMChildModel, "custom startPromptInst endRespondPrompt", startPromptInst, endRespondPrompt, llmchildsystemPromptInst)

	log.debug(consoleLogPrefix, "______________callLLMChildThoughtProcessor_backend", " ", "NPU Split Decision");
	if (allowedAllocNPULayer <= 0){
		allowedAllocNPULayer = 1;
	}
	if (availableImplementedLLMModelSpecificCategory[validatedModelAlignedCategory].diskEnforceWheelspin == 1){
		allowedAllocNPULayer = 1;
		allowedAllocNPUDraftLayer = 9999;
	} else {
		allowedAllocNPUDraftLayer = allowedAllocNPULayer;
	}

	// Do not allow the LLMChild to allocate to GPU or Neural Accelerator if its Busy being generated by other thread
	if(NeuralAcceleratorEngineBusyState){
		allowedAllocNPULayer=0;
		allowedAllocNPUDraftLayer=0;
	}
	log.debug(consoleLogPrefix, "______________callLLMChildThoughtProcessor_backend", " ", "Setting Param");
	log.debug(consoleLogPrefix, "______________callLLMChildThoughtProcessor_backend", `LLMChild Prompt`, prompt);
	/*
	how llm trained

	*/
	LLMChildParam = `-p \" ${startPromptInst} ${prompt} \n ${endRespondPrompt}\" -m ${currentUsedLLMChildModel} -ctk ${ctxCacheQuantizationLayer} -ngl ${allowedAllocNPULayer} -ngld ${allowedAllocNPUDraftLayer} --mirostat 2 -n ${lengthGen} --threads ${threads} -c 0 -s ${definedSeed_LLMchild} ${basebinLLMBackendParamPassedDedicatedHardwareAccel}`;

	command = `${basebin} ${LLMChildParam}`;
	log.debug(consoleLogPrefix, "______________callLLMChildThoughtProcessor_backend exec subprocess");
	try {
	log.debug(consoleLogPrefix, "______________callLLMChildThoughtProcessor_backend", `LLMChild Inference ${command}`);
	NeuralAcceleratorEngineBusyState=true;
	outputLLMChild = await runShellCommand(command);
	NeuralAcceleratorEngineBusyState=false;
	if(childLLMDebugResultMode){
		log.debug(consoleLogPrefix, "______________callLLMChildThoughtProcessor_backend ", 'LLMChild Raw output:', outputLLMChild);
	}
	} catch (error) {
	log.error("______________callLLMChildThoughtProcessor_backend ",'Error occoured spawning LLMChild!', flag, error.message);
	}	
	// ---------------------------------------
	/*
	function stripThoughtHeader(input) {
		const regex = /__([^_]+)__/g;
		return input.replace(regex, '');
	}
	*/

	function stripThoughtHeader(str){
		// Find the index of the last occurrence of "__" in the string
		let lastIndex = str.lastIndexOf(`${endRespondPrompt}`);
		// If "__" is not found, return the original string
		if (lastIndex === -1) {
		  return str;
		}
		// Otherwise, return the substring after the last "__"
		else {
		  //return str.substring(lastIndex + 2); //replace +2 with automatic calculation on how much character on the _Flag
		  return str.substring(lastIndex + endRespondPrompt.length);
		}
	}
	log.debug(consoleLogPrefix, "______________callLLMChildThoughtProcessor_backend raw Output", outputLLMChild);
	filteredOutput = stripThoughtHeader(outputLLMChild);
	//filteredOutput = filteredOutput.replace(/\n/g, "\\n");
	filteredOutput = filteredOutput.replace(/\r/g, "");
	filteredOutput = filteredOutput.replace(/__/g, '');
	filteredOutput = filteredOutput.replace(/"/g, '\\"');
	filteredOutput = filteredOutput.replace(/`/g, '');
	filteredOutput = filteredOutput.replace(/\//g, '\\/');
	filteredOutput = filteredOutput.replace(/'/g, '\\\'');
	if(childLLMDebugResultMode){
		log.debug(consoleLogPrefix, `LLMChild Thread Output`, filteredOutput); // filtered output
	}
	//
	//log.info(consoleLogPrefix, 'LLMChild Filtering Output');
	//return filteredOutput;
	filteredOutput = stripProgramBreakingCharacters(filteredOutput);
	filteredOutput = stripProgramBreakingCharacters_childLLM(filteredOutput);
	//log.info(consoleLogPrefix, "______________callLLMChildThoughtProcessor_backend Done");
	filteredOutput = `${filteredOutput}`
	return filteredOutput;

}


// Default startEndThoughtProcessor_Flag but it will be overridden
let startEndThoughtProcessor_Flag = "OutputResponse:"; // we can remove [ThoughtProcessor] word from the phrase to prevent any processing or breaking the chat context on the LLM and instead just use ___ three underscores

const startEndAdditionalContext_Flag = ""; //global variable so every function can see and exclude it from the chat view
// we can savely blank out the startEndAdditionalContext flag because we are now based on the blockGUI forwarding concept rather than flag matching
const DDG = require("duck-duck-scrape"); // might migrate later near the scraping subsystem
//BackBrainQueue Global Var
let BackBrainQueue = [];
let BackBrainResultQueue = [];



let resultSearchScraping;
let promptInput;
let mergeText;
let inputPromptCounterSplit;
let inputPromptCounter = [];
let historyChatRetrieved = [];
let inputPromptCounterThreshold = 6;
let emotionlist;
let evaluateEmotionInteraction;
let emotionalEvaluationResult = "happy"; //default is the "happy" value 
let specificSpecializedModelPathRequest_LLMChild=""; //Globally inform on what currently needed for the specialized model branch 
let specificSpecializedModelCategoryRequest_LLMChild=""; //Globally inform on what currently needed for the specialized model branch 
let LLMChildDecisionModelMode=false;
let defectiveLLMChildSpecificModel=false; //Some LLM Model cause a havoc on the zero output text detection and stuck on infinite loop like for instance the LLMChild requesting Indonesian LLM which usually biased upon (I'm not sure why just yet), it will produces no output at all and stuck on loop forever (It maybe caused by corrupted model from the download Manager, further investigation required) 
let internalThoughtEngineProgress=0; // 0-100% just like progress
let internalThoughtEngineTextProgress="";
let globalTPID = [0, 1, 2, 3]; // if removed go back to 0
log.debug(consoleLogPrefix, "globalTPID Debug", globalTPID);

function interactionContextFetching(requestedPrompt, historyDistance){

	// Make this Access UMA rather than directly to Interactionstg array
	// Actually no, Mix it! UMA Retrieval + Interaction Array Storage

	// Also when accessing UMA make sure that its calling interactionArrayStorage(retrieve ) with the specific string that its needed something like interactionArrayStorage("retrieveMLCMCF", currentPrompt, false, false, interactionStgOrder-i) so that the interactionArrayStorage can get the context too which is required for the MLCMCF architecture


	//interactionArrayStorage("retrieve", "", false, false, interactionStgOrder-1);
	if (historyDistance >= interactionStgOrder){
		log.info(consoleLogPrefix, `Requested ${historyDistance} History Depth/Distances doesnt exist, Clamping to ${interactionStgOrder}`);
		historyDistance = interactionStgOrder;
	}
	log.info(consoleLogPrefix, `Retrieving Chat History with history Depth ${historyDistance}`);
	let str = "";
	// log.debug(consoleLogPrefix, "Retrieving bigger scope from UMA using MLCMCF ", historyDistance)

	for (let i = historyDistance; i >= 1; i--){
		  str += `${interactionArrayStorage("retrieve", "", false, false, interactionStgOrder-i)} \n`
		  
		  //log.info(i + ": " + str);
		  //deduplicate string to reduce the size need to be submitted which optimizes the input size and bandwidth
		}
	//log.info(consoleLogPrefix, "__interactionContextFetchingFlexResult \n", str);
	if (requestedPrompt == "SKIP_MLCMCF"){
		str = str;
	}else{
		const additionalContextLargeScope = interactionArrayStorage("retrieve_MLCMCF_Mode", requestedPrompt, false, false, historyDistance); // rather than -i or in for loop it can be directly called historyDistance as the depth request
		str += `Addendum: ${additionalContextLargeScope.join('\n')}`;
	}
	return str;
}

// External Sensory Subsystem
// stub function and a reference for later rewrite on using OOP object oriented but less insane than the Java
class sensorySubsystem{
		// Graphic or Vision Neural Network
	async graphicalSensorySubsystem(stub){ // requires a compatibility with LLMChild LLaVa Mode
		// this is a stub function not yet to be implemented
		// Create a framebuffer and Camera capture system
	}
	//Audio Neural Network subsystem
	async audioSensorySubsystem(stub){
		// Create a microphone and speaker system
	}
	// miscExtIOPlainText Neural Network Subsystem
	async miscSensoryIOPlainTextsubsystem(stub){
		// write something that represent cat /dev/... read in raw text string format
	}
}

class pythonVenvSubsystem{
	async stubfunc(stub){

	}
}


function isBlankOrWhitespaceTrue_CheckVariable(variable){
	//log.info(consoleLogPrefix, "Checking Variable", variable)
	if (variable === undefined || variable.trim().length === 0 || variable === '') {
		return true;
	  } else {
		return false;
	  }
}


// File Management
// Delete file function
async function deleteFile(filePath) {
    try {
        await fs.promises.unlink(filePath);
        log.info(`File ${filePath} deleted successfully.`);
    } catch (error) {
        log.info(`Error deleting file ${filePath}:`, error);
    }
}

// downloadManager subsystem
const ongoingDownloads = {}; // Object to track ongoing downloads by targetFile
let timeoutDownloadRetry = 2000; // try to set it 2000ms and above, 2000ms below cause the download to retry indefinitely
function downloadFile(link, targetFile) {
	//log.info(consoleLogPrefix, link, targetFile)
    if (ongoingDownloads[targetFile]) {
        log.info(`${consoleLogPrefix} File ${targetFile} is already being downloaded.`);
        return; // Exit if the file is already being downloaded
    }

    const downloadID = generateRandomNumber("0", "999999999");
    const fileTempName = `${targetFile}.temporaryChunkModel`;
	let startByte = 0; // Initialize startByte for resuming download
	let inProgress = false;

    // Check if the file exists (possibly corrupted from previous download attempts)
    if (fs.existsSync(targetFile)) {
        log.info(`${consoleLogPrefix} File ${targetFile} Model already exists.`);
		// delete any possibility of temporaryChunkModel still exists
		if (fs.existsSync(fileTempName)){
			deleteFile(fileTempName); //delete the fileTemp
		}
    }
	//log.info(`${consoleLogPrefix} File ${fileTempName} status.`);
	if (fs.existsSync(fileTempName)) {
		//log.info(`${consoleLogPrefix} File ${fileTempName} already exists. Possible network corruption and unreliable network detected, attempting to Resume!`);
        const stats = fs.statSync(fileTempName);
        startByte = stats.size; // Set startByte to the size of the existing file
		if (!resumeFeatureReadyRelease){
			log.error(`${consoleLogPrefix} ⏩ Progress detected! Not going to attempt resume. Complete reset progress`);
		} else {
			log.info(`${consoleLogPrefix} ⏩ Progress detected! attempting to resume ${targetFile} from ${startByte} Bytes size!`);
		}
		inProgress = true;
		if (startByte < 100000 || !resumeFeatureReadyRelease ){
			if(!resumeFeatureReadyRelease){
				log.error(`Download resume feature is disabled due to issue on corruption`)
			}else{
				log.error(`${consoleLogPrefix} Invalid Progress, Overwriting!`);
			}
			fs.unlinkSync(fileTempName);
			inProgress = false;
		}
    }else{
		inProgress = false;
	}

	let file
	if (inProgress){
		log.info(`Continuing ${targetFile}`)
		file = fs.createWriteStream(fileTempName, { flags: 'a' }); // 'a' flag to append to existing file
	}else{
		file = fs.createWriteStream(fileTempName); // 'w' flag to completely overwrite the progress file
	}
    
    let constDownloadSpamWriteLength = 0;
    let lastChunkTime = Date.now();
	let checkLoopTime=1000
	let downloadIDTimedOut = {};
    const timeoutCheckInterval = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - lastChunkTime;
		if (!downloadIDTimedOut[downloadID]){
		//log.info(`${consoleLogPrefix} Package chunk was recieved for ${targetFile} download ID ${downloadID} within ${elapsedTime}ms `)
        if (elapsedTime > timeoutDownloadRetry && fs.existsSync(fileTempName)) {
			constDownloadSpamWriteLength += 1;
            file.end();
            //fs.unlinkSync(fileTempName); // Rather than Redownloading the whole thing, it is now replaced with resume
			log.info(downloadIDTimedOut);
			log.info(`${consoleLogPrefix} Download timeout for ${targetFile}. ${elapsedTime} ${currentTime} ${lastChunkTime}. Abandoning Download ID ${downloadID} and retrying New...`);
			delete ongoingDownloads[targetFile]; // Mark the file as not currently downloaded when being redirected or failed
			// adjust timeoutDownloadRetry to adapt with the Internet Quality with maximum 300 seconds
			if (timeoutDownloadRetry <= 300000){
				timeoutDownloadRetry = timeoutDownloadRetry + generateRandomNumber(300, 3000);
			}else{
				timeoutDownloadRetry = 300000;
			}
			log.info(`${consoleLogPrefix} Adjusting Timeout to your Internet, trying timeout setting ${timeoutDownloadRetry}ms`)
			downloadIDTimedOut[downloadID] = true;
            return downloadFile(link, targetFile);
			log.info(`im going through!!!`);
        }}
    }, checkLoopTime);

    ongoingDownloads[targetFile] = true; // Mark the file as being downloaded

	let options
	if (inProgress){
	options = {
        headers: {
            Range: `bytes=${startByte}-`, // Set the range to resume download from startByte
            'User-Agent': internetUserAgent
        }
    };
	}else{
		options = { headers: { 'User-Agent': internetUserAgent } };
	}

    https.get(link, options, response => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
            clearInterval(timeoutCheckInterval);
			delete ongoingDownloads[targetFile]; // Mark the file as not currently downloaded when being redirected or failed
            return downloadFile(response.headers.location, targetFile);
        }

        const totalSize = parseInt(response.headers['content-length'], 10);
        let downloadedSize = 0;

        log.info(`${consoleLogPrefix} 💾 Starting Download ${targetFile}!`);

        response.on('data', chunk => {
			if (!downloadIDTimedOut[downloadID]){ //Only download when LLMChild idle to have a better response time
            file.write(chunk);
            downloadedSize += chunk.length;
            const progress = ((downloadedSize / totalSize) * 100).toFixed(2);
            constDownloadSpamWriteLength += 1;
            lastChunkTime = Date.now();
			const currentTime = Date.now();
            if ((constDownloadSpamWriteLength % 1000) == 0) {
                log.info(`${consoleLogPrefix} [ 📥 ${downloadID} ] [ 🕰️ ${lastChunkTime} ] : Downloading ${targetFile}... ${progress}%`);
            }}
        });

        response.on('end', () => {
            clearInterval(timeoutCheckInterval);
            file.end();
            log.info(`${consoleLogPrefix} Download completed.`);

            fs.rename(fileTempName, targetFile, err => {
                if (err) {
                    log.info(`${consoleLogPrefix} Error finalizing download:`, err);
					delete ongoingDownloads[targetFile]; // Mark the file as not currently downloaded when being redirected or failed
                } else {
                    log.info(`${consoleLogPrefix} Finalized!`);
                }
            });

            delete ongoingDownloads[targetFile]; // Remove the file from ongoing downloads
        });

        response.on('error', err => {
            log.info(`${consoleLogPrefix} 🛑 Unfortunately There is an Issue on the Internet`, `${targetFile}`, err);
            //fs.unlinkSync(fileTempName); // Rather than Redownloading the whole thing, it is now replaced with resume
            log.info(`${consoleLogPrefix} ⚠️ Retrying automatically in 5 seconds...`);
            clearInterval(timeoutCheckInterval);
            delete ongoingDownloads[targetFile]; // Remove the file from ongoing downloads
            setTimeout(() => {
                downloadFile(link, targetFile);
            }, 5000);
        });
    });
}

function prepareDownloadModel(){
	win.webContents.send("modelPathValid", { data: false }); //Hack to make sure the file selection Default window doesnt open
	log.info(consoleLogPrefix, "Please wait while we Prepare your Model..");
	log.info(consoleLogPrefix, "Invoking first use mode!", availableImplementedLLMModelSpecificCategory);
	const prepModel = specializedModelManagerRequestPath("general_conversation");
	//win.webContents.send("modelPathValid", { data: true });
}

// This is required since the model sometimes doesn't return exact 1:1 with the name category which caused a lockup since the key doesn't exists
function findClosestMatch(input, keysArray) {
	let closestMatch = null;
	let minDistance = Infinity; // Start with a large value
  
	// Iterate through each key in the keysArray
	for (const key of keysArray) {
	  const distance = computeLevenshteinDistance(input.toLowerCase(), key.toLowerCase());
	  
	  // If the current key has a smaller distance, update the closestMatch and minDistance
	  if (distance < minDistance) {
		minDistance = distance;
		closestMatch = key;
	  }
	}
  
	return closestMatch;
  }
  
// Function to compute Levenshtein distance
function computeLevenshteinDistance(a, b) {
if (a.length === 0) return b.length;
if (b.length === 0) return a.length;

const matrix = [];

// Initialize matrix
for (let i = 0; i <= b.length; i++) {
	matrix[i] = [i];
}

for (let j = 0; j <= a.length; j++) {
	matrix[0][j] = j;
}

// Calculate Levenshtein distance
for (let i = 1; i <= b.length; i++) {
	for (let j = 1; j <= a.length; j++) {
	const cost = a[j - 1] === b[i - 1] ? 0 : 1;
	matrix[i][j] = Math.min(
		matrix[i - 1][j] + 1,
		matrix[i][j - 1] + 1,
		matrix[i - 1][j - 1] + cost
	);
	}
}

return matrix[b.length][a.length];
}

// Function to check if a file exists
function checkFileExists(filePath) {
    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        return true;
    } catch (err) {
        return false;
    }
}
let validatedModelAlignedCategory=""; //defined with blankspace to prevent undefined issue 
function specializedModelManagerRequestPath(modelCategory){
	// "specializedModelKeyList" variable is going to be used as a listing of the available category or lists
	log.info(consoleLogPrefix, specializedModelKeyList)
	// Available Implemented LLM Model Category can be fetched from the variable availableImplementedLLMModelSpecificCategory
	//log.info(consoleLogPrefix, "Requesting!", modelCategory);
	// Check all the file if its available
	//Checking Section -------------
	for (let i = 0; i < specializedModelKeyList.length; i++) {
		const currentlySelectedSpecializedModelDictionary = specializedModelKeyList[i];
		const DataDictionaryFetched = availableImplementedLLMModelSpecificCategory[currentlySelectedSpecializedModelDictionary];
		//log.info(consoleLogPrefix, "Checking Specialized Model", currentlySelectedSpecializedModelDictionary);
		//log.info(consoleLogPrefix, `\n Model Category Description ${DataDictionaryFetched.CategoryDescription} \n Download Link ${DataDictionaryFetched.downloadLink} \n Download Link ${DataDictionaryFetched.filename} `)
		if (!fs.existsSync(`${DataDictionaryFetched.filename}`) && (!isBlankOrWhitespaceTrue_CheckVariable(DataDictionaryFetched.downloadLink))) {
			log.info("Attempting to Download", DataDictionaryFetched.downloadLink);
			const currentlySelectedSpecializedModelURL = `${DataDictionaryFetched.downloadLink}`; // Replace with your download link
			downloadFile(currentlySelectedSpecializedModelURL, `${DataDictionaryFetched.filename}`);
		  } else {
			// clean any temporaryChunkModel if model already exists 
			// delete any possibility of temporaryChunkModel still exists
			const fileTempName = `${DataDictionaryFetched.filename}.temporaryChunkModel`
			if (fs.existsSync(fileTempName)){
				deleteFile(fileTempName); //delete the fileTemp
			}
		  }
		
	}
	//------------------------------
	log.info(consoleLogPrefix, "[Requested Specialized LLMChild] ", modelCategory);
	// filter out the request input with the available key

	//const keys = Object.keys(availableImplementedLLMModelSpecificCategory);
    //return keys.filter(key => key.includes(keyword));
	const filteredModelCategoryRequest = findClosestMatch(modelCategory, specializedModelKeyList);
	let filePathSelectionfromDictionary;
	log.info(consoleLogPrefix, "Matched with :", filteredModelCategoryRequest);
	validatedModelAlignedCategory = filteredModelCategoryRequest;
	const DataDictionaryFetched = availableImplementedLLMModelSpecificCategory[filteredModelCategoryRequest];
	if (filteredModelCategoryRequest == "" || filteredModelCategoryRequest == undefined || !(checkFileExists(DataDictionaryFetched.filename)) || (`${DataDictionaryFetched.downloadLink}` == '')){
		filePathSelectionfromDictionary = `${availableImplementedLLMModelSpecificCategory["general_conversation"].filename}`
		log.info(consoleLogPrefix, "modelManager: Fallback to general conversation");
	}else{
		filePathSelectionfromDictionary = `${DataDictionaryFetched.filename}`
		log.info(consoleLogPrefix, "modelManager : Model Detected!", filePathSelectionfromDictionary);
	}
	return filePathSelectionfromDictionary;
}

async function zombieTPIDGuardian(localTPID, globalTPID){
	// make this function check whether the local TPID still exists on globalTPID array, if it doesn't then lock the localTPID caller into infinite loop and make it doesn't eat any percievable resources (usually timed out llmchild from QoS)
	// Call this with await zombieTPIDGuardian(localTPID, globalTPID);
	log.debug(consoleLogPrefix, "Checking ZombieTPIDGuardian");
	log.debug(consoleLogPrefix, "Checking ZombieTPIDGuardian", localTPID, globalTPID);
	if (!globalTPID.includes(localTPID)) {
		internalThoughtEngineProgress=0;
		internalThoughtEngineTextProgress="Zombie TPID Caught!";
        while (true) {
			log.error(consoleLogPrefix, "Zombie internal Thought Thread detected and tamed!")
            await new Promise(resolve => setTimeout(resolve, 999999999));
        }
    }
}

function removeFromGlobalTPID(numberToRemove) {
    globalTPID = globalTPID.filter(number => number !== numberToRemove);
    log.debug(`Number ${numberToRemove} removed from globalTPID array.`);
    return globalTPID;
}

let BackbrainMode=false;
async function callInternalThoughtEngine(prompt){
	let passedOutput="";
	let decisionBinaryKey = ["yes", "no"];
	let BackbrainModeInternal = false;
	let reevaluateAdCtx;
	let reevaluateAdCtxDecisionAgent;
	let concludeInformation_CoTMultiSteps = "Nothing";
	let required_CoTSteps;
	let historyDistanceReq;
	let concatenatedCoT="";
	let concludeInformation_Internet = "Nothing";
	let concludeInformation_LocalFiles = "Nothing";
	let concludeInformation_chatHistory = "Nothing";
	let todoList;
	let todoListResult;
	let fullCurrentDate;
	let searchPrompt="";
	let decisionSearch;
	let decisionSpecializationLLMChildRequirement;
	let decisionChatHistoryCTX;

	// What is the different here? why there's two?
	// globalTPID is the variable to the Global on the internal Thought Process ID that is running
	// localTPID is for the local variable just to its aware of its self ID
	log.debug(globalTPID);
	const localTPID=generateRandomNumber(1, 99999999);
	globalTPID.push(localTPID);
	log.debug(globalTPID);

	log.debug(consoleLogPrefix, "🍀", "InternalThoughtEngine invoked!");
	if (BackbrainMode || BackbrainModeInternal){
		log.debug(consoleLogPrefix, "🍀", "InternalThoughtEngine invoked with Backbrain MODE!, EXPERIMENTAL ASYNC LLM PROCESSING INITIATED");
		BackbrainModeInternal=true;
		BackbrainMode=false;
	}else{
		BackbrainModeInternal=false;
		BackbrainMode=false;
	}
	log.debug(consoleLogPrefix, "🍀", "InternalThoughtEngine CheckedBackbrain!");
	internalThoughtEngineProgress=2;
	// were going to utilize this findClosestMatch(decision..., decisionBinaryKey); // new algo implemented to see whether it is yes or no from the unpredictable LLM Output
	if (store.get("params").llmdecisionMode){
		// Ask on how many numbers of Steps do we need, and if the model is failed to comply then fallback to 5 steps
		log.debug(consoleLogPrefix, "🍀", "InternalThoughtEngine evaluating mem fetch");
		promptInput = `${username}:${prompt}\n Based on your evaluation of the request submitted by ${username}, could you please ascertain the number of sequential steps, ranging from 1 to 50, necessary to acquire the relevant historical context to understand the present situation? Answer only in numbers:`;
		log.debug(consoleLogPrefix, "🍀", "InternalThoughtEngine evaluating mem fetch");
		internalThoughtEngineTextProgress="Acquiring Interaction Context";
		await zombieTPIDGuardian(localTPID, globalTPID);
		log.debug(consoleLogPrefix, "🍀", "InternalThoughtEngine invoke");
		historyDistanceReq = await callLLMChildThoughtProcessor(promptInput, 32);
		log.debug(consoleLogPrefix, "🍀", "InternalThoughtEngine invoke");
		historyDistanceReq = onlyAllowNumber(historyDistanceReq);
		log.info(consoleLogPrefix, "Required History Distance as Context", historyDistanceReq);

		if (isVariableEmpty(historyDistanceReq)){
			historyDistanceReq = 5;
			log.error(consoleLogPrefix, "historyDistanceReq Retrieval Failure due to model failed to comply, Falling back to 5 History Depth/Distance");
		}
	}else{
		historyDistanceReq = 5;
		log.info(consoleLogPrefix, "historyDistanceReq Mode");
	}
	log.info(consoleLogPrefix, "🍀", "Retrieving History!");
	internalThoughtEngineTextProgress="Retrieving History!";
	historyChatRetrieved=interactionContextFetching(prompt, historyDistanceReq);
	concludeInformation_chatHistory=historyChatRetrieved;
	
	// Counting the number of words in the Chat prompt and history
	inputPromptCounterSplit = prompt.split(" ");
	inputPromptCounter[0] = inputPromptCounterSplit.length;

	inputPromptCounterSplit = historyChatRetrieved;
	inputPromptCounter[1] = inputPromptCounterSplit.length;
    //store.get("params").longChainThoughtNeverFeelenough
	reevaluateAdCtx=true; // to allow run the inside the while commands
	while (reevaluateAdCtx){
		if (!store.get("params").classicMode){
		const currentDate = new Date();
		const year = currentDate.getFullYear();
		const month = String(currentDate.getMonth() + 1).padStart(2, '0');
		const day = String(currentDate.getDate()).padStart(2, '0');
		const hours = String(currentDate.getHours()).padStart(2, '0');
		const minutes = String(currentDate.getMinutes()).padStart(2, '0');
		const seconds = String(currentDate.getSeconds()).padStart(2, '0');
		fullCurrentDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
		//decision if yes then do the query optimization
		// -----------------------------------------------------
		log.info(consoleLogPrefix, "============================================================");
		// Categorization of What Chat is this going to need to answer and does it require specialized Model
		// 
		//-------------------------------------------------------

		// Variables that going to be used in here decisionSpecializationLLMChildRequirement, specificSpecializedModelCategoryRequest_LLMChild, specificSpecializedModelPathRequest_LLMChild
		// Main model will be default and locked into Mistral_7B since it is the best of the best for quick thinking before digging into deeper
		// Specialized Model Category that will be implemented will be for now : General_Conversation, Coding, Language_Specific_Indonesia, Language_Specific_Japanese, Language_Specific_English, Language_Specific_Russia, Language_Specific_Arabics, Chemistry, Biology, Physics, Legal_Bench, Medical_Specific_Science, Mathematics, Financial
		// Category can be Fetched through the variable availableImplementedLLMModelSpecificCategory it will be a dictionary or array 
		// Specialized Model Table on what to choose on develop with can be fetched from this table https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard
		internalThoughtEngineProgress=28; // Randomly represent progress (its not representing the real division so precision may be not present)
		log.info(consoleLogPrefix, "============================================================");
		//decisionSpecializationLLMChildRequirement
		// using llmdecisionMode
		if (store.get("params").llmdecisionMode){
			//promptInput = `Only answer in one word either Yes or No. Anything other than that are not accepted without exception. Should I Search this on the Internet for more context or current information on this chat. ${historyChatRetrieved}\n${username} : ${prompt}\n Your Response:`;
			promptInput = `\`\`\` ${historyChatRetrieved}\n${username} : ${prompt}\n. \`\`\` With the previous Additional Context is \`\`\` ${passedOutput}\n \`\`\`. From this Interaction Should I use more specific LLM Model for better Answer,\n Only answer Yes or No!`;
			internalThoughtEngineTextProgress="Checking Specific/Specialized/Experts Model Fetch Requirement!";
			log.info(consoleLogPrefix, "🍀", internalThoughtEngineTextProgress);
			LLMChildDecisionModelMode = true;
			await zombieTPIDGuardian(localTPID, globalTPID);
			decisionSpecializationLLMChildRequirement = await callLLMChildThoughtProcessor(promptInput, 512);
			decisionSpecializationLLMChildRequirement = decisionSpecializationLLMChildRequirement.toLowerCase();
			//decisionSpecializationLLMChildRequirement = findClosestMatch(decisionSpecializationLLMChildRequirement, decisionBinaryKey); // This makes heavy weight on the "yes" decision
		} else {
			decisionSpecializationLLMChildRequirement = "yes"; // without LLM deep decision
		}
		if ((((decisionSpecializationLLMChildRequirement.includes("yes") || decisionSpecializationLLMChildRequirement.includes("i need") || decisionSpecializationLLMChildRequirement.includes("yep") || decisionSpecializationLLMChildRequirement.includes("ok") || decisionSpecializationLLMChildRequirement.includes("valid") || decisionSpecializationLLMChildRequirement.includes("should") || decisionSpecializationLLMChildRequirement.includes("true")) && (inputPromptCounter[0] > inputPromptCounterThreshold || inputPromptCounter[1] > inputPromptCounterThreshold )) || process.env.SPECIALIZED_MODEL_DEBUG_MODE === "1")){
			if (store.get("params").llmdecisionMode){
				promptInput = `\`\`\`${historyChatRetrieved}\n${username} : ${prompt}\n\`\`\`. With the previous Additional Context is \`\`\`${passedOutput}\n\`\`\`. From this interaction what category from this category \" ${specializedModelKeyList.join(", ")}\n \". What category this chat categorized as?\n only answer the category!`;
				await zombieTPIDGuardian(localTPID, globalTPID);
				specificSpecializedModelCategoryRequest_LLMChild = await callLLMChildThoughtProcessor(promptInput, 512);
				log.info(consoleLogPrefix, promptInput, "Requesting Model Specialization/Branch", specificSpecializedModelCategoryRequest_LLMChild);
				// Requesting the specific Model Path on the Computer (and check whether it exists or not , and if its not it will download)
				specificSpecializedModelPathRequest_LLMChild = specializedModelManagerRequestPath(specificSpecializedModelCategoryRequest_LLMChild);
			}else{
				specificSpecializedModelCategoryRequest_LLMChild = `${historyChatRetrieved[2]}. ${historyChatRetrieved[1]}. ${prompt}`
				specificSpecializedModelCategoryRequest_LLMChild = specificSpecializedModelCategoryRequest_LLMChild.replace(/None\./g, "");
				specificSpecializedModelPathRequest_LLMChild = specializedModelManagerRequestPath(specificSpecializedModelCategoryRequest_LLMChild);
			}
		}else{
			internalThoughtEngineTextProgress="Doesnt seem to require specific Category Model, reverting to null or default model";
			log.info(consoleLogPrefix, "🍀", internalThoughtEngineTextProgress);
			specificSpecializedModelCategoryRequest_LLMChild="";
			specificSpecializedModelPathRequest_LLMChild="";
		}
		log.info(consoleLogPrefix, "============================================================");
		internalThoughtEngineProgress=39; // Randomly represent progress (its not representing the real division so precision may be not present)

		// External Data Part
		//-------------------------------------------------------
		log.info(consoleLogPrefix, "============================================================");
		
		// This is for the Internet Search Data Fetching
		if (store.get("params").llmdecisionMode && store.get("params").webAccess){
			//promptInput = `Only answer in one word either Yes or No. Anything other than that are not accepted without exception. Should I Search this on the Internet for more context or current information on this chat. ${historyChatRetrieved}\n${username} : ${prompt}\n Your Response:`;
			promptInput = `\`\`\`${historyChatRetrieved}\n${username} : ${prompt}\n\`\`\`. With the previous Additional Context is \`\`\`\n${passedOutput}\n\`\`\` (Ignore if its blank) . From this Interaction Should I Search this on the Internet,\n Only answer Yes or No!`;
			internalThoughtEngineTextProgress="Checking Internet Fetch Requirement!";
			log.info(consoleLogPrefix, "🍀", internalThoughtEngineTextProgress);
			LLMChildDecisionModelMode = true;
			await zombieTPIDGuardian(localTPID, globalTPID);
			decisionSearch = await callLLMChildThoughtProcessor(promptInput, 12);
			decisionSearch = decisionSearch.toLowerCase();
			//decisionSearch = findClosestMatch(decisionSearch, decisionBinaryKey); // This made the "yes" answer wayy to heavy 
			log.info(consoleLogPrefix, "Internet Fetch?", decisionSearch); //comment this when done debugging
		} else {
			decisionSearch = "yes"; // without LLM deep decision
		}
		//log.info(consoleLogPrefix, ` LLMChild ${decisionSearch}`);
		// explanation on the inputPromptCounterThreshold
		// Isn't the decision made by LLM? Certainly, while LLM or the LLMChild contributes to the decision-making process, it lacks the depth of the main thread. This can potentially disrupt the coherence of the prompt context, underscoring the importance of implementing a safety measure like a word threshold before proceeding to the subsequent phase.
		if ((((decisionSearch.includes("yes") || decisionSearch.includes("i need") || decisionSearch.includes("yep") || decisionSearch.includes("ok") || decisionSearch.includes("valid") || decisionSearch.includes("should") || decisionSearch.includes("true")) && (inputPromptCounter[0] > inputPromptCounterThreshold || inputPromptCounter[1] > inputPromptCounterThreshold )) || process.env.INTERNET_FETCH_DEBUG_MODE === "1") && store.get("params").webAccess){
			if (store.get("params").llmdecisionMode){
				log.debug(consoleLogPrefix, "LLM Decision Prompting...");
				promptInput = `\`\`\`${historyChatRetrieved}\n${username} : ${prompt}\n\`\`\`. With the previous Additional Context is \`\`\`\n${passedOutput}\n\`\`\` (Ignore if its blank) \n. To answer this, what's to search`;
				log.debug(consoleLogPrefix, "Waiting Search Prompt...", ":", promptInput);
				await zombieTPIDGuardian(localTPID, globalTPID);
				searchPrompt = await callLLMChildThoughtProcessor(promptInput, 69);
				internalThoughtEngineTextProgress="🍀🌐 Creating Search Prompt for Internet Search!";
				log.debug(consoleLogPrefix, "🍀", internalThoughtEngineTextProgress);
				log.debug(consoleLogPrefix, `search prompt has been created`);
			}else{
				searchPrompt = `${historyChatRetrieved[2]}. ${historyChatRetrieved[1]}. ${prompt}`
				log.info(consoleLogPrefix, `Internet Search prompt creating is using legacy mode for some strange reason`);
				//searchPrompt = searchPrompt.replace(/None\./g, "");
			}
			//promptInput = ` ${historyChatRetrieved}\n${username} : ${prompt}\n. With this interaction What search query for i search in google for the interaction? Search Query:`;
			//searchPrompt = await callLLMChildThoughtProcessor(promptInput, 64);
			log.info(consoleLogPrefix, `Created internet search prompt ${searchPrompt}`);
			log.debug(consoleLogPrefix, "🍀🌐 externalInternetFetchingScraping Triggering");
			resultSearchScraping = await externalInternetFetchingScraping(searchPrompt);
			if (store.get("params").llmdecisionMode){
				inputPromptCounterSplit = resultSearchScraping.split(" ");
				inputPromptCounter[3] = inputPromptCounterSplit.length;
			if (resultSearchScraping && inputPromptCounter[3] > inputPromptCounterThreshold){
				resultSearchScraping = stripProgramBreakingCharacters(resultSearchScraping);
				promptInput = `Summerize this info: ${resultSearchScraping} Summerization:`;
				internalThoughtEngineTextProgress="Summarizing LLMChild";
				log.info(consoleLogPrefix, "🍀", internalThoughtEngineTextProgress);
				//let concludeInformation_Internet;
				await zombieTPIDGuardian(localTPID, globalTPID);
				concludeInformation_Internet = await callLLMChildThoughtProcessor(stripProgramBreakingCharacters(stripProgramBreakingCharacters(promptInput)), 1024);
			} else {
				concludeInformation_Internet = "Nothing";
			}
			} else {
				concludeInformation_Internet = resultSearchScraping;
			}
		} else {
			log.info(consoleLogPrefix, "No Dont need to search it on the internet");
			concludeInformation_Internet = "Nothing";
			log.info(consoleLogPrefix, concludeInformation_Internet);
		}

		//-------------------------------------------------------
		log.info(consoleLogPrefix, "============================================================");
		internalThoughtEngineProgress=48; // Randomly represent progress (its not representing the real division so precision may be not present)

		// This is for the Local Document Search Logic
		if (store.get("params").llmdecisionMode && store.get("params").localAccess){
			//promptInput = `Only answer in one word either Yes or No. Anything other than that are not accepted without exception. Should I Search this on the user files for more context information on this chat ${historyChatRetrieved}\n${username} : ${prompt}\n Your Response:`;
			promptInput = `\`\`\`${historyChatRetrieved}\n${username} : ${prompt}\n\`\`\`.With the previous Additional Context is \`\`\`\n${passedOutput}\n\`\`\` (Ignore if its blank). From this Interaction do i have the knowledge to answer this? Should I Search this on the Local Documents, Only answer Yes or No!`;
			log.info(consoleLogPrefix, "Checking Local File Fetch Requirement!");
			LLMChildDecisionModelMode = true;
			await zombieTPIDGuardian(localTPID, globalTPID);
			decisionSearch = await callLLMChildThoughtProcessor(promptInput, 18);
			decisionSearch = decisionSearch.toLowerCase();
			//decisionSearch = findClosestMatch(decisionSearch, decisionBinaryKey); //As i said before
		} else {
			decisionSearch = "yes"; // without LLM deep decision
		}

		//localAccess variable must be taken into account
		if ((((decisionSearch.includes("yes") || decisionSearch.includes("yep") || decisionSearch.includes("i need") || decisionSearch.includes("ok") || decisionSearch.includes("valid") || decisionSearch.includes("should") || decisionSearch.includes("true")) && (inputPromptCounter[0] > inputPromptCounterThreshold || inputPromptCounter[1] > inputPromptCounterThreshold)) || process.env.LOCAL_FETCH_DEBUG_MODE === "1") && store.get("params").localAccess){
			if (store.get("params").llmdecisionMode){
				log.info(consoleLogPrefix, "We need to search it on the available resources");
				promptInput = `\`\`\`${historyChatRetrieved}\n${username} : ${prompt}\n\`\`\`. With the previous Additional Context is \`\`\`\n${passedOutput}\n\`\`\` (Ignore if its blank) . To answer this, what's to search`;
				log.info(consoleLogPrefix, `LLMChild Creating Search Prompt`);
				await zombieTPIDGuardian(localTPID, globalTPID);
				searchPrompt = await callLLMChildThoughtProcessor(promptInput, 64);
				log.info(consoleLogPrefix, `LLMChild Prompt ${searchPrompt}`);
				log.info(consoleLogPrefix, `LLMChild Looking at the Local Documents...`);
			} else {
				searchPrompt = prompt;
			}
			resultSearchScraping = await externalLocalFileScraping(searchPrompt);
			if (store.get("params").llmdecisionMode){
				inputPromptCounterSplit = resultSearchScraping.split(" ");
				inputPromptCounter[3] = inputPromptCounterSplit.length;
			if (resultSearchScraping && inputPromptCounter[3] > inputPromptCounterThreshold){
			promptInput = `Summerize this info: ${resultSearchScraping}. Summerization:`;
			log.info(consoleLogPrefix, `LLMChild Concluding...`);
			await zombieTPIDGuardian(localTPID, globalTPID);
			concludeInformation_LocalFiles = await callLLMChildThoughtProcessor(promptInput, 512);
		} else {
			concludeInformation_LocalFiles = "Nothing";
		}
			} else {
				concludeInformation_LocalFiles = resultSearchScraping;
			}
		} else {
			log.info(consoleLogPrefix, "No, we shouldnt do it only based on the model knowledge");
			concludeInformation_LocalFiles = "Nothing";
			log.info(consoleLogPrefix, concludeInformation_LocalFiles);
		}
		
		internalThoughtEngineProgress=64; // Randomly represent progress (its not representing the real division so precision may be not present)

		// ----------------------- CoT Steps Thoughts --------------------
		log.info(consoleLogPrefix, "============================================================");
		log.info(consoleLogPrefix, "Checking Chain of Thoughts Depth requirement Requirement!");
		if (store.get("params").llmdecisionMode){
			//promptInput = `Only answer in one word either Yes or No. Anything other than that are not accepted without exception. Should I create 5 step by step todo list for this interaction ${historyChatRetrieved}\n${username} : ${prompt}\n Your Response:`;
			promptInput = `\`\`\`${historyChatRetrieved}\n${username} : ${prompt}\n\`\`\`. With the previous Additional Context is \`\`\`\n${passedOutput}\n\`\`\` (Ignore if its blank) . For the additional context this is what i summerize from Internet ${concludeInformation_Internet}. \n This is what i summerize from the Local Files ${concludeInformation_LocalFiles}. \n From this Interaction and additional context Should I Answer this in 5 steps Yes or No? Answer only in Numbers:`;
			LLMChildDecisionModelMode = true;
			await zombieTPIDGuardian(localTPID, globalTPID);
			decisionSearch = await callLLMChildThoughtProcessor(promptInput, 32);
			decisionSearch = decisionSearch.toLowerCase();
			//decisionSearch = findClosestMatch(decisionSearch, decisionBinaryKey); // I don't want to explain it 
		} else {
			decisionSearch = "yes"; // without LLM deep decision
		}
		if ((((decisionSearch.includes("yes") || decisionSearch.includes("yep") || decisionSearch.includes("i need") || decisionSearch.includes("ok") || decisionSearch.includes("valid") || decisionSearch.includes("should") || decisionSearch.includes("true")) && (inputPromptCounter[0] > inputPromptCounterThreshold || inputPromptCounter[1] > inputPromptCounterThreshold )) || process.env.CoTMultiSteps_FETCH_DEBUG_MODE === "1") && store.get("params").extensiveThought){
			if (store.get("params").llmdecisionMode){
				
				// Ask on how many numbers of Steps do we need, and if the model is failed to comply then fallback to 5 steps
				// required_CoTSteps
				
				promptInput = `\`\`\`${historyChatRetrieved}\n${username} : ${prompt}\n\`\`\` From this context from 1 to 27 how many steps that is required to answer. Answer:`;
				await zombieTPIDGuardian(localTPID, globalTPID);
				required_CoTSteps = await callLLMChildThoughtProcessor(promptInput, 16);
				required_CoTSteps = onlyAllowNumber(required_CoTSteps);
				internalThoughtEngineTextProgress=`Required ${required_CoTSteps} CoT steps`;
				log.info(consoleLogPrefix, "🍀", internalThoughtEngineTextProgress);

				if (isVariableEmpty(required_CoTSteps)){
					required_CoTSteps = 5;
					log.info(consoleLogPrefix, "CoT Steps Retrieval Failure due to model failed to comply, Falling back")
				}
				log.info(consoleLogPrefix, "We need to create thougts instruction list for this prompt");
				log.info(consoleLogPrefix, `Generating list for this prompt`);
				promptInput = `\`\`\`${historyChatRetrieved}\n${username} : ${prompt}\n\`\`\` From this chat List ${required_CoTSteps} steps on how to Answer it. Answer:`;
				promptInput = stripProgramBreakingCharacters(promptInput);
				await zombieTPIDGuardian(localTPID, globalTPID);
				todoList = await callLLMChildThoughtProcessor(promptInput, 512);

				for(let iterate = 1; iterate <= required_CoTSteps; iterate++){
					log.info(consoleLogPrefix, );
					internalThoughtEngineTextProgress=`Processing Chain of Thoughts Step, ${iterate}`;
					log.info(consoleLogPrefix, "🍀", internalThoughtEngineTextProgress);
					promptInput = ` What is the answer to the List number ${iterate} : ${todoList} Answer/NextStep:"`;
					promptInput = stripProgramBreakingCharacters(promptInput);
					await zombieTPIDGuardian(localTPID, globalTPID);
					todoListResult = stripProgramBreakingCharacters(await callLLMChildThoughtProcessor(promptInput, 1024));
					concatenatedCoT = concatenatedCoT + ". " + todoListResult;
					log.info(consoleLogPrefix, iterate, "Result: ", todoListResult);
				}
			} else {
				concatenatedCoT = prompt;
			}
			if (store.get("params").llmdecisionMode){
			promptInput = `Summerization from the internal Thoughts?  \`\`\`"${concatenatedCoT}\`\`\` `;
			internalThoughtEngineTextProgress=`LLMChild Concluding Chain of Thoughts...`;
			log.info(consoleLogPrefix, "🍀", internalThoughtEngineTextProgress);
			promptInput = stripProgramBreakingCharacters(promptInput);
			await zombieTPIDGuardian(localTPID, globalTPID);
			concludeInformation_CoTMultiSteps = stripProgramBreakingCharacters(await callLLMChildThoughtProcessor(promptInput, 1024));
			} else {
				//let concludeInformation_CoTMultiSteps;
				concludeInformation_CoTMultiSteps = "Nothing";
			}
		} else {
			log.info(consoleLogPrefix, "No, we shouldnt do it only based on the model knowledge");
			//let concludeInformation_CoTMultiSteps;
			concludeInformation_CoTMultiSteps = "Nothing";
			log.info(consoleLogPrefix, concludeInformation_CoTMultiSteps);
		}
		internalThoughtEngineProgress=78; // Randomly represent progress (its not representing the real division so precision may be not present)

		log.info(consoleLogPrefix, "============================================================");
			log.info(consoleLogPrefix, "Executing LLMChild Emotion Engine!");
			
			emotionlist = "Happy, Sad, Fear, Anger, Disgust";
			if (store.get("params").emotionalLLMChildengine){
				promptInput = `\`\`\`${historyChatRetrieved}\n${username} : ${prompt}\n\`\`\`. \n From this conversation which from the following emotions ${emotionlist} are the correct one?`;
				internalThoughtEngineTextProgress=`LLMChild Evaluating Interaction With Emotion Engine...`;
				log.info(consoleLogPrefix, "🍀", internalThoughtEngineTextProgress);
				promptInput = stripProgramBreakingCharacters(promptInput);
				await zombieTPIDGuardian(localTPID, globalTPID);
				evaluateEmotionInteraction = await callLLMChildThoughtProcessor(promptInput, 64);
				evaluateEmotionInteraction = evaluateEmotionInteraction.toLowerCase();
				if (evaluateEmotionInteraction.includes("happy")){
					emotionalEvaluationResult = "happy";
				} else if (evaluateEmotionInteraction.includes("sad")){
					emotionalEvaluationResult = "sad";
				} else if (evaluateEmotionInteraction.includes("fear")){
					emotionalEvaluationResult = "fear";
				} else if (evaluateEmotionInteraction.includes("anger")){
					emotionalEvaluationResult = "anger";
				} else if (evaluateEmotionInteraction.includes("disgust")){
					emotionalEvaluationResult = "disgust";
				} else {
					log.info(consoleLogPrefix, `LLMChild Model failed to comply, falling back to default value`);
					emotionalEvaluationResult = "happy"; // return "happy" if the LLM model refuse to work
				}
				log.info(consoleLogPrefix, `LLMChild Emotion Returned ${emotionalEvaluationResult}`);
				win.webContents.send('emotionalEvaluationResult', emotionalEvaluationResult);
			}else{
				emotionalEvaluationResult = "happy"; // return "happy" if the engine is disabled
				win.webContents.send('emotionalEvaluationResult', emotionalEvaluationResult);
			}

		//concludeInformation_chatHistory
		//log.info(concludeInformation_CoTMultiSteps);
		//log.info(concludeInformation_Internet);
		//log.info(concludeInformation_LocalFiles);
		//log.info(concludeInformation_chatHistory);
		internalThoughtEngineProgress=89; // Randomly represent progress (its not representing the real division so precision may be not present)

		if((concludeInformation_Internet === "Nothing" || concludeInformation_Internet === "undefined" || isBlankOrWhitespaceTrue_CheckVariable(concludeInformation_Internet) ) && (concludeInformation_LocalFiles === "Nothing" || concludeInformation_LocalFiles === "undefined" || isBlankOrWhitespaceTrue_CheckVariable(concludeInformation_LocalFiles)) && (concludeInformation_CoTMultiSteps === "Nothing" || concludeInformation_CoTMultiSteps === "undefined" || isBlankOrWhitespaceTrue_CheckVariable(concludeInformation_CoTMultiSteps)) && (concludeInformation_chatHistory === "Nothing" || concludeInformation_chatHistory === "undefined" || isBlankOrWhitespaceTrue_CheckVariable(concludeInformation_chatHistory))){
			log.debug(consoleLogPrefix, "Bypassing Additional Context");
			passedOutput = prompt;
		} else {
			concludeInformation_Internet = concludeInformation_Internet === "Nothing" ? "" : concludeInformation_Internet;
			concludeInformation_LocalFiles = concludeInformation_LocalFiles === "Nothing" ? "" : concludeInformation_LocalFiles;
			concludeInformation_CoTMultiSteps = concludeInformation_CoTMultiSteps === "Nothing" ? "" : concludeInformation_CoTMultiSteps;
			mergeText = startEndAdditionalContext_Flag + " " + `\n This is my message: ` + "\""+ prompt + "\"" + " " + "These are the information you might need for answering the prompt or conversation, " + `\n You feel \"${emotionalEvaluationResult}\", ` + "\n Right now is: " + fullCurrentDate + ". "+ "\n I also found this, " + concludeInformation_Internet + concludeInformation_LocalFiles + concludeInformation_CoTMultiSteps + "\n" + startEndAdditionalContext_Flag;
			mergeText = mergeText.replace(/\n/g, " "); //.replace(/\n/g, " ");
			passedOutput = mergeText;
			log.info(consoleLogPrefix, "Combined Context", mergeText);
		}
		log.debug(consoleLogPrefix, "🍀", "Passing Thoughts information");
		}else{
			passedOutput = prompt;
		}

		//If detected there's BackBrainResultQueue then Merge it with the new prompt 
		let BackBrainResultPop
		if (BackBrainResultQueue > 0){
			const latestIndex = BackBrainResultQueue.length - 1;
			BackBrainResultPop = BackBrainResultQueue[latestIndex];
			BackBrainResultQueue.pop();
			passedOutput = passedOutput + `Also I just finished thinking for this one ${BackBrainResultPop}`;
		}

		internalThoughtEngineProgress=93; // Randomly represent progress (its not representing the real division so precision may be not present)
		if(store.get("params").longChainThoughtNeverFeelenough && store.get("params").llmdecisionMode){
			log.debug(consoleLogPrefix, "🍀", "Evaluating Information Post Process Raw");
			promptInput = `\`\`\`This is the previous conversation ${historyChatRetrieved}\n. \n This is the conversation ${username} : ${prompt}\n. \n\n While this is the context \n The current time and date is now: ${fullCurrentDate},\n Answers from the internet ${concludeInformation_Internet}.\n and this is Answer from the Local Files ${concludeInformation_LocalFiles}.\n And finally this is from the Chain of Thoughts result ${concludeInformation_CoTMultiSteps}\`\`\`. \n Is this enough? if its not, should i rethink and reprocess everything? Answer only with Yes or No!`;
			log.debug(consoleLogPrefix, "🍀", "LLMChild Evaluating Information PostProcess");
			LLMChildDecisionModelMode = true;
			await zombieTPIDGuardian(localTPID, globalTPID);
			reevaluateAdCtxDecisionAgent = stripProgramBreakingCharacters(await callLLMChildThoughtProcessor(promptInput, 128));
			log.info(consoleLogPrefix, `${reevaluateAdCtxDecisionAgent}`);
			//reevaluateAdCtxDecisionAgent = findClosestMatch(reevaluateAdCtxDecisionAgent, decisionBinaryKey); // This for some reason have oversensitivity to go to "yes" answer
			if (reevaluateAdCtxDecisionAgent.includes("yes") || reevaluateAdCtxDecisionAgent.includes("yep") || reevaluateAdCtxDecisionAgent.includes("ok") || reevaluateAdCtxDecisionAgent.includes("valid") || reevaluateAdCtxDecisionAgent.includes("should") || reevaluateAdCtxDecisionAgent.includes("true")){
				reevaluateAdCtx = true;
				randSeed = generateRandSeed();
				log.info(consoleLogPrefix, `Context isnt good enough! Still lower than standard! Shifting global seed! ${randSeed}`);
				
				log.info(consoleLogPrefix, reevaluateAdCtxDecisionAgent);
			} else {
				log.info(consoleLogPrefix, `Passing Context!`);
				reevaluateAdCtx = false;
			}
		}else{
			reevaluateAdCtx = false;
		}
	}
	passedOutput = promptInput;

	//reset to 0 to when it finished
	internalThoughtEngineProgress=0; // Randomly represent progress (its not representing the real division so precision may be not present)
	log.info(consoleLogPrefix, passedOutput);
	if (BackbrainMode || BackbrainModeInternal){ // if Backbrainmode detected then push it into BackBrainResultQueue to 
		BackBrainResultQueue.push(passedOutput); // This will push to the result queue when the user asks something again then this will be pushed too
		BackbrainModeInternal = false;
		BackbrainMode = false;
	}
	log.debug(consoleLogPrefix, "DONE! removing loal TPID", localTPID);
	removeFromGlobalTPID(localTPID);
	log.debug(consoleLogPrefix, "DONE! Handing over prompt into the mainLLM engine!");
	return passedOutput;

}

// define it globally
let QoSTimeoutSpeicificSubcategory_beforeAdjustedConfig = store.get("params").qostimeoutllmchildsubcategory;
let QoSTimeoutGlobal_beforeAdjustedConfig = store.get("params").qostimeoutllmchildglobal;
let InternalEngineMainThreadOnFocusRunning = false;
// Wrapper for internalThoughtWithTimeout
async function callInternalThoughtEngineWithTimeoutandBackbrain(data) {
	let result;
	let detectedNewestTPIDatLaunch;
	const globalQoSTimeoutMultiplier = BackBrainQueue.length + 1;
	const globalQoSTimeoutAdjusted = QoSTimeoutGlobal_beforeAdjustedConfig * globalQoSTimeoutMultiplier;
	

	if (!InternalEngineMainThreadOnFocusRunning){
	InternalEngineMainThreadOnFocusRunning=true; // disable mainLLM pipeline, and if recieved a new request, then it will be redirected to backbrain thread
    // Create a promise that resolves after the specified timeout
    const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
            resolve({ timeout: true });
        }, globalQoSTimeoutAdjusted);
    });
	
	const consoleLogPrefixQoSDebug = "[🏃⌛ QoS Enforcement Manager]";
	log.info(consoleLogPrefix, consoleLogPrefixQoSDebug, `DEBUG QoS Global Target `, globalQoSTimeoutAdjusted);
    // Create a promise for the call to callInternalThoughtEngine
    const callPromise = callInternalThoughtEngine(data);

    // Race between the call promise and the timeout promise
    result = await Promise.race([callPromise, timeoutPromise]);

	detectedNewestTPIDatLaunch = globalTPID[globalTPID.length - 1];
	let BackbrainRequest;
    // Check if the result is from the timeout
    if (result.timeout) {
        log.info(consoleLogPrefix, consoleLogPrefixQoSDebug, 'QoS Global Timeout occurred');//
		// Wait until NeuralAccelerator isn't busy using while loop
		// Then report on what ID of childLLM that is driven by the internalThought that occoured a QoS
		// then if childLLM aware that it is running on the one that timed out, then the process will lockup and in here we will remove the ID of the internal Thought from the list 
		internalThoughtEngineProgress=0;
		internalThoughtEngineTextProgress="QoS internal Thought Timeout!";
		removeFromGlobalTPID(detectedNewestTPIDatLaunch);
		while(NeuralAcceleratorEngineBusyState){
			log.error(consoleLogPrefix, consoleLogPrefixQoSDebug, "🛑 Awaiting on the time Free Async Process Queue...")
			await delay(1000);
		}
		

		result = `This is the user prompt: ${data}, Additional Context is not available!`
		log.info(consoleLogPrefix, consoleLogPrefixQoSDebug, result);
		// Ask LLM if its require to do backbrain async operation?
		if (store.get("params").llmdecisionMode){
			// Ask on how many numbers of Steps do we need, and if the model is failed to comply then fallback to 5 steps
			log.info(consoleLogPrefix, consoleLogPrefixQoSDebug, 'Prompting Decision LLM for Backbrain...');
			promptInput = `${username}:${data}\n Based on your evaluation of the request submitted by ${username}, Should you continue to think deeper even if you did timed out before and is it worth it to continue? Answer only in Yes or No:`;
			log.info(consoleLogPrefix, consoleLogPrefixQoSDebug, 'Decision BackBrain Request LLM');
			BackbrainRequest = await callLLMChildThoughtProcessor(promptInput, 32);
			if (isVariableEmpty(BackbrainRequest)){
				log.info(consoleLogPrefix, consoleLogPrefixQoSDebug, "BackbrainRequest Failure due to model failed to comply, Falling back to no");
				BackbrainRequest = no;
			}
		}else{
			log.info(consoleLogPrefix, consoleLogPrefixQoSDebug, "Continuing with Backbrain Mode! LLM aren't allowed to decide");
			BackbrainRequest = yes;
		}

		// So what's the answer?
		if (((((BackbrainRequest.includes("yes") || BackbrainRequest.includes("yep") || BackbrainRequest.includes("ok") || BackbrainRequest.includes("valid") || BackbrainRequest.includes("should") || BackbrainRequest.includes("true"))) || process.env.BACKBRAIN_FORCE_DEBUG_MODE === "1")) && store.get("params").backbrainqueue ){
			//passthrough with queueing
			log.info(consoleLogPrefix, consoleLogPrefixQoSDebug, 'Decision BackBrain Exec');
			BackBrainQueue.push(data); //add to the array later on it will be executed by async function BackBrainQueueManager() that constantly check whether there is a required
			log.info(consoleLogPrefix, consoleLogPrefixQoSDebug, BackBrainQueue);
			BackBrainQueueManager(); //Launch/invoke the thread and check if its already running
			log.info(consoleLogPrefix, consoleLogPrefixQoSDebug, 'Spawning Background Task Backbrain');
			// Move this into async Function BackBrainQueueManager
			
			log.info(consoleLogPrefix, consoleLogPrefixQoSDebug, 'Pushing classic prompt non RAG Model');
			result = `This is the user prompt: ${data}, Additional Context is not yet available!`
		}else{
			//passthrough without queuing
			log.info(consoleLogPrefix, consoleLogPrefixQoSDebug, 'Better not to do Backbrain Queueing');
			result = `This is the user prompt: ${data}, Additional Context is not available!`
		}

    } else {
        // Handle the result from callInternalThoughtEngine
        log.info(consoleLogPrefix, consoleLogPrefixQoSDebug,'Internal thought engine completed successfully:', result);
    }
	}else{
		log.error(consoleLogPrefix, `⚠️ ${username} Attempting to communicate Multi-input Human-like Mode!`);
		// Asking whether it need to be processed and answered or just let it be
		if (store.get("params").llmdecisionMode){
			// Ask on how many numbers of Steps do we need, and if the model is failed to comply then fallback to 5 steps
			log.info(consoleLogPrefix, consoleLogPrefixQoSDebug, 'Prompting Decision LLM for Backbrain...');
			promptInput = `${username}:${data}\n Based on your evaluation of the request submitted by ${username}, Should you continue to think deeper even if you did timed out before and is it worth it to continue? Answer only in Yes or No:`;
			log.info(consoleLogPrefix, consoleLogPrefixQoSDebug, 'Decision BackBrain Request LLM');
			BackbrainRequest = await callLLMChildThoughtProcessor(promptInput, 32);
			if (isVariableEmpty(BackbrainRequest)){
				log.info(consoleLogPrefix, consoleLogPrefixQoSDebug, "BackbrainRequest Failure due to model failed to comply, Falling back to no");
				BackbrainRequest = no;
			}
		}else{
			log.info(consoleLogPrefix, consoleLogPrefixQoSDebug, "Continuing with Backbrain Mode! LLM aren't allowed to decide");
			BackbrainRequest = yes;
		}

		// If accepted to be answered then...
		if (((((BackbrainRequest.includes("yes") || BackbrainRequest.includes("yep") || BackbrainRequest.includes("ok") || BackbrainRequest.includes("valid") || BackbrainRequest.includes("should") || BackbrainRequest.includes("true"))) || process.env.BACKBRAIN_FORCE_DEBUG_MODE === "1")) && store.get("params").backbrainqueue ){
			//passthrough with queueing
			log.info(consoleLogPrefix, consoleLogPrefixQoSDebug, 'Decision BackBrain Exec');
			BackBrainQueue.push(data); //add to the array later on it will be executed by async function BackBrainQueueManager() that constantly check whether there is a required
			log.info(consoleLogPrefix, consoleLogPrefixQoSDebug, BackBrainQueue);
			BackBrainQueueManager(); //Launch/invoke the thread and check if its already running
			log.error(consoleLogPrefix, consoleLogPrefixQoSDebug, '⚠️ Queuing multi submission into Backbrain submission stack');
		}else{
			//passthrough without queuing
			log.info(consoleLogPrefix, consoleLogPrefixQoSDebug, 'Better not to do Backbrain Queueing');
			log.error(consoleLogPrefix, consoleLogPrefixQoSDebug, '⚠️ Will not answer the Multi-Submission question');
		}
		// DO NOT CHANGE THIS RESULT, this is the key for Not submitting to mainLLM to allow multisubmission message, so if it detected then it will skip to be submitted to tty mainLLM
		result = `THIS IS MULTISUBMISSION POWERED BY BACKBRAIN, IGNORE AND DO NOT SUBMIT TO MAINLLM`
	}
	InternalEngineMainThreadOnFocusRunning=false; // enable mainLLM pipeline
	removeFromGlobalTPID(detectedNewestTPIDatLaunch);
	return result;
}

// Backbrain manager is the one that manages and when it is the best time to Process the Unfinished Processing that got caught on the QoS Global LLMChild Timeout
let BackBrainQueueManager_isRunning=false;
async function BackBrainQueueManager(){
	//call this function to spawn the Loop threads and it only happened once
	let detectedNewestTPIDatLaunch;
	if(BackBrainQueueManager_isRunning){
		log.info(consoleLogPrefix, "BackBrainQueueManager Invoked but already running! Declining");
	}else{
		log.info(consoleLogPrefix, "Running BackBrainQueueManager!");
		BackBrainQueueManager_isRunning=true;
		//Loop every 30 seconds check or every QoSTimeoutGlobal parameter
		while(true){
			if( BackBrainQueue.length > 0 && internalThoughtEngineProgress == 0 ){ // Only launch when its idle or after the timed out thread expired
				const latestIndex = BackBrainQueue.length - 1;
				const queuePrompt = BackBrainQueue[latestIndex];
				BackBrainQueue.pop();
				BackbrainMode=true; // when recieved the callInternalThoughtEngine quickly flip it back to false and transfer it into const BackbrainModeInternal=true; ; to make sure there isn't any conflict
				callInternalThoughtEngine(queuePrompt); //spawn it in async fashion
				detectedNewestTPIDatLaunch = globalTPID[globalTPID.length - 1];
			}
			await new Promise(resolve => setTimeout(resolve, store.get("params").qostimeoutllmchildglobal));
			removeFromGlobalTPID(detectedNewestTPIDatLaunch);

		}
	}

}

// Local File Scraping Text Agent
let externalLocalFileScrapingTextAgent_BackgroundAgentActive=false;
let foundArticlesBackgroundAgentFileScraper;

// this function instead of making the chat waiting too long, it job is to stay on background and fill what found on the drive into UMA with push command (UnifiedMemoryArray.push(...foundArticlesBackgroundAgentFileScraper);) and later on let the UMA cosine of similiarity decide which array should be picked
//const { spawn } = require('child_process'); //already declared
const { exec } = require('child_process');
const { parse } = require('node-html-parser');
// const { promisify } = require('util'); // Has been called


const mammoth = require('mammoth');
const pdf = require('pdf-parse');

const readdirAsync = promisify(fs.readdir);
const readFileAsync = promisify(fs.readFile);
const execAsync = promisify(exec);

class ExternalLocalFileScraperBackgroundAgent {
    constructor(searchText) {
        this.searchText = searchText;
        this.targetDirectoryList = [];
        //this.unifiedMemoryArray = []; // replace this directly with UnifiedMemoryArray
        this.isRunning = false;
        this.documentsLearned = 0;
    }

    async scanTargetDirectories() {
        const platform = os.platform();
        switch (platform) {
            case 'darwin': // macOS
                this.targetDirectoryList.push(os.homedir(), '/Volumes');
                break;
            case 'linux': // Linux
                this.targetDirectoryList.push(os.homedir(), '/mnt', `/media/${os.userInfo().username}`);
                break;
            case 'win32': // Windows
                const driveLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                for (let i = 0; i < driveLetters.length; i++) {
                    const drivePath = `${driveLetters[i]}:\\`;
                    if (fs.existsSync(drivePath)) {
                        this.targetDirectoryList.push(drivePath);
                    }
                }
                break;
            default:
                log.info('Unsupported platform:', platform);
                break;
        }
    }

    async processDocument(filePath) {
        try {
            const extension = path.extname(filePath).toLowerCase();
            if (['.pdf', '.docx', '.doc', '.odt', '.ppt', '.pptx'].includes(extension)) {
				// for formatted document
				//log.info(consoleLogPrefix,`📖 Debug Learning text document: ${filePath}`);
                await this.extractTextFromDocument(filePath);
			
            } else if ([ '.md', '.rtf', '.html', '.xml', '.json', '.tex', '.csv', '.yaml', '.textile', '.adoc', '.tex', '.postscript', '.sgml', '.tr', '.fountain', '.csv', '.xml', '.html','.c', '.cpp', '.java', '.py', '.js', '.css', '.rb', '.swift', '.go', '.php', '.sh', '.bat', '.sql', '.json', '.xml', '.md', '.yaml', '.asm', '.tex', '.r', '.m', '.rs', '.dart', '.scala', '.kt'].includes(extension)){
				// md, rtf, html, xml, json, tex, csv, yaml, textile, adoc, tex, postscript, sgml, tr, fountain,.csv, .xml, .html, .xlsm, .xlsb, .c, .cpp, .java, .py, .js, .css, .rb, .swift, .go, .php, .sh, .bat, .sql, .json, .xml, .md, .yaml, .asm, .tex, .r, .m, .rs, .dart, .scala, .kt
				// for not formatted document
                const content = await readFileAsync(filePath, 'utf8');
                UnifiedMemoryArray.push(content);
				//log.info(consoleLogPrefix, "📖 Debug",UnifiedMemoryArray);
                this.documentsLearned++;
                //log.info(consoleLogPrefix,`📖 Debug Learning raw text document: ${filePath}`);
            } else {
				//log.info(consoleLogPrefix,`📖 Debug ⛔ Skipping this Documents: ${filePath}, not yet supported!`);
			}
        } catch (error) {
            log.info(`${consoleLogPrefix} Error 📖 ⛔ Learning ${this.documentsLearned} document: ${filePath}: ${error.message}`);
        }
    }

    async extractTextFromDocument(filePath) {
        let text = '';
        if (['.pdf'].includes(path.extname(filePath).toLowerCase())) {
            const dataBuffer = await readFileAsync(filePath);
            text = await pdf(dataBuffer);
            text = text.text;
        } else if (['.docx', '.doc', '.odt', '.ppt', '.pptx'].includes(path.extname(filePath).toLowerCase())) {
            text = await mammoth.extractRawText({ path: filePath });
        }
        UnifiedMemoryArray.push(text);
        this.documentsLearned++;
        //log.info(`📖 Debug Processed document: ${filePath}`);
    }

    async scanAndProcessDocuments(directory) {
        try {
            const files = await readdirAsync(directory);
            for (const file of files) {
				if ((this.documentsLearned % 1000) == 0) {
					log.info(consoleLogPrefix, `[📖 Documents Background RAG] I have Learned and refreshed ${this.documentsLearned} Literature in this session`);
					interactionArrayStorage("flushPersistentMem", 0, 0, 0, 0); // Flush UMA MLCMCF and all memory to save progress
				}
                const filePath = path.join(directory, file);
                const stats = fs.statSync(filePath);
                if (stats.isDirectory()) {
                    await this.scanAndProcessDocuments(filePath);
                } else {
                    await this.processDocument(filePath);
                }
				// Learning Documents Throttle based on loadAvg[0]*1
				await delay(timeDegradationSmoothingPause);
            }
        } catch (error) {
            log.info(`Error scanning directory ${directory}: ${error.message}`);
        }
    }

    async startScanning() {
        if (this.isRunning || externalLocalFileScrapingTextAgent_BackgroundAgentActive) {
            log.error('📖 Another invocation detected! Learning is already in progress!');
            return;
        }
        this.isRunning = true;
		externalLocalFileScrapingTextAgent_BackgroundAgentActive = true;
        await this.scanTargetDirectories();
        for (const directory of this.targetDirectoryList) {
            await this.scanAndProcessDocuments(directory);
        }
        this.isRunning = false;
		externalLocalFileScrapingTextAgent_BackgroundAgentActive = false;
        log.info(`Scanning completed. Total documents learned: ${this.documentsLearned}`);
    }
}

async function externalLocalFileScraperBackgroundAgent(searchText) {

	const userHomeDir = require('os').homedir();
	const rootDirectory = path.join(userHomeDir, 'Documents'); // You can change the root directory as needed
	// also make an exception for Windows users usually do C:\ D:\ Drive instead of unified folder or instead of mounting it directly into the folder (if you didn't know that even exist) they mount it into a diffrent letter


	// Lets implement class inside function just to make the transition seamless

	const agent = new ExternalLocalFileScraperBackgroundAgent(searchText);
    agent.startScanning();


	/*
	Old unusuable Code
	const userHomeDir = require('os').homedir();
	const rootDirectory = path.join(userHomeDir, 'Documents'); // You can change the root directory as needed
  
	const result = [];
	let totalChars = 0;
  
	async function searchInDirectory(directoryPath) {
		const files = await readdir(dir);
		const matches = [];
	  
		for (const file of files) {
		  const filePath = path.join(dir, file);
		  const fileStat = await stat(filePath);
	  
		  if (fileStat.isDirectory()) {
			matches.push(...await searchFiles(filePath, keyword));
		  } else if (fileStat.isFile() && /\.(pdf|docx|txt)$/i.test(file)) {
			const content = await fs.promises.readFile(filePath, 'utf8');
	  
			if (content.includes(keyword)) {
			  log.info(`Found ${keyword} in ${filePath}`);
			  matches.push({
				file: filePath,
				match: content.match(new RegExp(`(.*${keyword}.*)`, 'i'))[0]
			  });
			}
		  }
		}
	  
		return matches;
	}
  
	result = searchInDirectory(rootDirectory);
	
	return result.join('\n');
	 */
  }

//const { exec } = require('child_process'); // Already defined, thus not required
function runShellCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}



async function externalLocalFileScraping(text){
	log.info(consoleLogPrefix, "called Local File Scraping");
	if (store.get("params").localAccess){
		log.debug(consoleLogPrefix, "externalLocalDataFetchingScraping");
		externalLocalFileScraperBackgroundAgent(text); // trigger the activation of background local file scraping
		// TODO: Replace this with a UnifiedMemoryAccess Cosine Similiarity access rather than calling local file scraping!
		// Content of the File will be indexed and stored in UMA, so to get it you need to access the UMA retrieve_MLCMCF_mode!
		log.info(consoleLogPrefix, "Accessing: ", "UnifiedMemoryArray");

		//var documentReadText = externalLocalFileScraperBackgroundAgent(text);
		//text = documentReadText.replace("[object Promise]", "");
		log.info(consoleLogPrefix, "Fetching Documents data from MLCMCF UMA architecture!");
		const resulttext = interactionArrayStorage("retrieve_MLCMCF_Mode", text, false, false, 3).join(''); // rather than -i or in for loop it can be directly called historyDistance as the depth request
		return resulttext;
	} else {
		log.info(consoleLogPrefix, "externalLocalFileScraping disabled");
        return "";
    }
}

function fileExists(filePath) {
    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        return true;
    } catch (err) {
        return false;
    }
}

let promptResponseCount;
let targetPlatform = '';

//=======================================



// Function to blacklist seed, the seed that detected to make the model repeats the word from the input or leaks the , "AdditionalContext", "DO NOT mirror the Additional Context" "The current time and date is now" "There are additional context to answer" method that the program used even if its instructed to not repeats the very thing 
let seedBlacklist=[];
let seedBlacklistListFile=`${path.resolve(__dirname, "badSeedTerminationList.json")}`;
class DPORuntimeAutomator {
    constructor() {
        // No need to accept parameters for interactionStg and interactionStgOrder
    }
    badSignatureDetection() {
		log.debug(consoleLogPrefix, "DPORuntimeAutomator fetching Interactionstg");
		//interactionStg[interactionSessionMemoryArrayFocus].data[interactionStgOrder - 1].content
        let currentInteraction="";
        let previousInteraction="";
        // Replace null values with an empty string
		log.debug(consoleLogPrefix, "DPORuntimeAutomator Now time to check whether we're still on the base stgOrder");
        if (!currentInteraction || !previousInteraction || interactionStgOrder === 0 || interactionStgOrder >= 4) {
			if (!currentInteraction){currentInteraction=""}
			if (!previousInteraction){previousInteraction=""}
            log.error('Invalid interaction index.');
            log.error('Current interaction:', currentInteraction);
            log.error('Previous interaction:', previousInteraction);
        }else{
			currentInteraction = interactionStg[interactionSessionMemoryArrayFocus].data[interactionStgOrder - 1].content;
        	previousInteraction = interactionStg[interactionSessionMemoryArrayFocus].data[interactionStgOrder - 2].content;
		}

        const currentWords = this.extractWords(currentInteraction);
        const previousWords = this.extractWords(previousInteraction);

        const repeatingWords = this.findRepeatingWords(currentWords, previousWords);
		//// log.debug(consoleLogPrefix, "Detecting Repeating Word!");
        if (repeatingWords.length > 0) {
            this.blacklistSeed(randSeed);
        }
		//// log.debug(consoleLogPrefix, "Detecting Trash Word!");
        // New detection for specified words and phrases
        const trashWords = ["AdditionalContext", "DO NOT mirror the Additional Context", "DO NOT", "There are additional context to answer", "The current time and date is now", "There are additional context to answer", "Current time and date", "verbos", "These are the information you might need for answering the prompt or conversation"];
        const detectedTrash = trashWords.filter(word => currentInteraction.includes(word)) + trashWords.filter(word => previousInteraction.includes(word));
        if (detectedTrash.length > 0) {
            log.error(consoleLogPrefix, "Trash Seed detected! Detected Keyword:", detectedTrash);
            this.blacklistSeed(randSeed);
        }
    }

    extractWords(interaction) {
        const words = [];
        // Split the interaction by spaces and remove any leading/trailing spaces
        const tokens = interaction.split(' ').map(word => word.trim());
        // Extract relevant words
        tokens.forEach(token => {
            if (token === 'AdditionalContext' || token.startsWith('###')) {
                words.push(token);
            }
        });
        return words;
    }

    findRepeatingWords(currentWords, previousWords) {
        const repeatingWords = [];
        // Count frequencies of words in current and previous interactions
        const currentWordFreq = this.calculateFrequency(currentWords);
        const previousWordFreq = this.calculateFrequency(previousWords);
        // Check if any word has a frequency over 50% in both interactions
        Object.keys(currentWordFreq).forEach(word => {
            if (
                currentWordFreq[word] / currentWords.length > 0.5 &&
                previousWordFreq[word] / previousWords.length > 0.5
            ) {
                repeatingWords.push(word);
            }
        });
        return repeatingWords;
    }

    calculateFrequency(words) {
        const freqMap = {};
        words.forEach(word => {
            freqMap[word] = (freqMap[word] || 0) + 1;
        });
        return freqMap;
    }

    blacklistSeed(badseed) {
		log.error(consoleLogPrefix, "Adding Seed to the Blacklist!", badseed);
        if (seedBlacklist.length === 0 && fileExists(seedBlacklistListFile)) {
            // Read json
            const data = fs.readFileSync(seedBlacklistListFile, 'utf8');
            const jsonData = JSON.parse(data);
            seedBlacklist.push(jsonData);
        } else {
            const jsonData = JSON.stringify(seedBlacklist);
            fs.writeFile(seedBlacklistListFile, jsonData, (err) => {
                if (err) {
                    log.error(consoleLogPrefix, 'Error writing file:', err);
                }
            });
        }
        seedBlacklist.push(badseed);
        log.error(consoleLogPrefix, "Bad Seed has been Terminated added to the blacklist!", badseed);
        // Push seed into the array list from (badseed)
    }
}

/*

Example Usage
// Example usage
const interactionStg = [
    "Some AdditionalContext text ###Instruction",
    "Some ###Instruction text ###Response",
    "Some AdditionalContext text ###Answer ###Response"
];
const interactionStgOrder = 2;

const detector = new DPORuntimeAutomator(interactionStg, interactionStgOrder);
detector.badSignatureDetection();
*/




function generateRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


let randSeed
let configSeed = store.get("params").seed;
let maxRandSeedRange=9999999999999999;
let minRandSeedRange=2;

function generateRandSeed(){

	function isPrime(number) {
		// If number is less than 2, it's not prime
		if (number < 2) {
			seedBlacklist.push(definedSeed_LLMchild);
			return false;
		}
		// Check for divisibility from 2 to the square root of the number
		for (let i = 2; i <= Math.sqrt(number); i++) {
			if (number % i === 0) {
				seedBlacklist.push(definedSeed_LLMchild);
				return false; // If divisible by any number, not prime
			}
		}
		return true; // If not divisible by any number, prime
	}

    let isBlacklisted = true;
	let randSeedResult;
	log.info(consoleLogPrefix, "Loading new seed, Might take a while...");
    while (isBlacklisted) {
        // Generate a random seed
        randSeedResult = generateRandomNumber(minRandSeedRange, maxRandSeedRange);

        // Check if the generated seed is blacklisted
		if (seedBlacklist.length === 0 && fileExists(seedBlacklistListFile)) {
            // Read json
			log.error(consoleLogPrefix, "seedBlacklist isn't loaded yet, Loading!");
            let jsonData = []; // Default value if file doesn't exist
			log.error(consoleLogPrefix, "seedBlacklist isn't loaded yet, Loading!");
			try {
				if (fs.existsSync(seedBlacklistListFile)) {
					const data = fs.readFileSync(seedBlacklistListFile, 'utf8');
					jsonData = JSON.parse(data);
				} else {
					log.error(consoleLogPrefix, `${seedBlacklistListFile} doesn't exist.`);
				}
			} catch (error) {
				log.error(consoleLogPrefix, "Error reading seedBlacklistListFile:", error);
			}
            seedBlacklist.push(jsonData);
        } 
        isBlacklisted = seedBlacklist.includes(randSeed);
		if(!isPrime(randSeedResult)){
			isBlacklisted = true;
		}
    }

	if (configSeed === "-1"){ 
		randSeedResult = randSeedResult;
		log.info(consoleLogPrefix, "Random Seed!", randSeedResult);
	} else {
		randSeedResult = configSeed;
		log.info(consoleLogPrefix, "Predefined Seed!", randSeedResult);
	}
	return randSeedResult;
}

randSeed = generateRandSeed();
log.info(consoleLogPrefix, "Defined Accepted Seed!", randSeed);



// RUNNING Main LLM GUI to User
let LLMBackendSelection;
let LLMBackendVariationBinaryFileName;
let LLMBackendVariationFileSubFolder;
let LLMBackendVariationSelected;
let LLMBackendAttemptDedicatedHardwareAccel=false; //false by default but overidden if AttempAccelerate varible set to true!

let basebin;
let basebinLLMBackendParamPassedDedicatedHardwareAccel=""; //global variable so it can be used on main LLM thread and LLMChild
let basebinBinaryMoreSpecificPathResolve;
function determineLLMBackend(){

	//--n-gpu-layers 256 Dedicated Hardware Acceleration
	// AttemptAccelerate variable will be determining whether the --n-gpu-layers will be passed through the params
	// store.get("params").AttemptAccelerate

	//var need to be concentrated on llmBackendMode

	/*if (platform === 'darwin') {
		targetPlatform = 'macOS';
	} else if (platform === 'win32') {
		targetPlatform = 'Windows';
	} else if (platform === 'linux') {
		targetPlatform = 'Linux';
	}
	
	let targetArch = '';
	
	if (arch === 'x64') {
		targetArch = 'x64';
	} else if (arch === 'arm64') {
		targetArch = 'arm64';
	}*/

	/*
	let allowedAllocNPULayer;
	let ctxCacheQuantizationLayer;
	let allowedAllocNPUDraftLayer;
	// --n-gpu-layers need to be adapted based on round(${store.get("params").hardwareLayerOffloading}*memAllocCutRatio)
	if(isBlankOrWhitespaceTrue_CheckVariable(specificSpecializedModelPathRequest_LLMChild)){
		allowedAllocNPULayer = Math.round(store.get("params").hardwareLayerOffloading * 1);
		ctxCacheQuantizationLayer = availableImplementedLLMModelSpecificCategory[validatedModelAlignedCategory].Quantization;
		currentUsedLLMChildModel=modelPath; //modelPath is the default model Path
		//log.info(consoleLogPrefix, "______________callLLMChildThoughtProcessor_backend",currentUsedLLMChildModel);
	} else {
		allowedAllocNPULayer = Math.round(store.get("params").hardwareLayerOffloading * availableImplementedLLMModelSpecificCategory[validatedModelAlignedCategory].memAllocCutRatio);
		ctxCacheQuantizationLayer = availableImplementedLLMModelSpecificCategory[validatedModelAlignedCategory].Quantization;
		currentUsedLLMChildModel=specificSpecializedModelPathRequest_LLMChild; // this will be decided by the main thought and processed and returned the path of specialized Model that is requested
	}

	if (allowedAllocNPULayer <= 0){
		allowedAllocNPULayer = 1;
	}
	if (availableImplementedLLMModelSpecificCategory[validatedModelAlignedCategory].diskEnforceWheelspin = 1){
		allowedAllocNPULayer = 1;
		allowedAllocNPUDraftLayer = 9999;
	} else {
		allowedAllocNPUDraftLayer = allowedAllocNPULayer;
	}

	LLMChildParam = `-p \"Answer and continue this with Response: prefix after the __ \n ${startEndThoughtProcessor_Flag} ${prompt} ${startEndThoughtProcessor_Flag}\" -m ${currentUsedLLMChildModel} -ctk ${ctxCacheQuantizationLayer} -ngl ${allowedAllocNPULayer} -ngld ${allowedAllocNPUDraftLayer} --temp ${store.get("params").temp} -n ${lengthGen} --threads ${threads} -c 2048 -s ${definedSeed_LLMchild} ${basebinLLMBackendParamPassedDedicatedHardwareAccel}`;

	*/

	let allowedAllocNPULayer;
	let ctxCacheQuantizationLayer;
	let allowedAllocNPUDraftLayer;
	allowedAllocNPULayer = Math.round(store.get("params").hardwareLayerOffloading * availableImplementedLLMModelSpecificCategory.general_conversation.memAllocCutRatio);
	ctxCacheQuantizationLayer = availableImplementedLLMModelSpecificCategory.general_conversation.Quantization;
	if (availableImplementedLLMModelSpecificCategory.general_conversation.diskEnforceWheelspin == 1){
		allowedAllocNPULayer = 1;
		allowedAllocNPUDraftLayer = 9999;
		log.info("wheelspin enforcement enabled");
	} else {
		allowedAllocNPUDraftLayer = allowedAllocNPULayer;
		log.info("wheelspin enforcement disabled");
	}

	if(store.get("params").AttemptAccelerate){
		basebinLLMBackendParamPassedDedicatedHardwareAccel=`-ngl ${allowedAllocNPULayer} -ctk ${ctxCacheQuantizationLayer} -ngld ${allowedAllocNPUDraftLayer}`;
	} else {
		basebinLLMBackendParamPassedDedicatedHardwareAccel="";
	}

	

	// change this into the predefined dictionary
	//LLMBackendSelection = store.get("params").llmBackendMode;

	LLMBackendSelection = `${availableImplementedLLMModelSpecificCategory.general_conversation.Engine}`
	/*
	<option value="LLaMa2">LLaMa-2</option>
									<option value="falcon">Falcon</option>
									<option value="starcoder">Starcoder</option>
									<option value="gptj">gpt-j</option>
	*/
	if (!LLMBackendSelection){
		log.info(consoleLogPrefix, "LLM Backend Selection Failed, falling back to Original LLaMa backend")
		LLMBackendSelection = "LLaMa2";
	}
	if (LLMBackendSelection === "LLaMa2"){
		LLMBackendVariationBinaryFileName = "llama";
		LLMBackendVariationFileSubFolder = "llama";
	}else if (LLMBackendSelection === "falcon"){
		LLMBackendVariationBinaryFileName = "falcon";
		LLMBackendVariationFileSubFolder = "falcon";
	}else if (LLMBackendSelection === "mpt"){
		LLMBackendVariationBinaryFileName = "mpt";
		LLMBackendVariationFileSubFolder = "ggml-mpt";
	}else if (LLMBackendSelection === "GPTNeoX"){
		LLMBackendVariationBinaryFileName = "gptneox";
		LLMBackendVariationFileSubFolder = "ggml-gptneox";
	}else if (LLMBackendSelection === "starcoder"){
		LLMBackendVariationBinaryFileName = "starcoder";
		LLMBackendVariationFileSubFolder = "ggml-starcoder";
	}else if (LLMBackendSelection === "gptj"){
		LLMBackendVariationBinaryFileName = "gptj";
		LLMBackendVariationFileSubFolder = "ggml-gptj";
	}else if (LLMBackendSelection === "gpt2"){
		LLMBackendVariationBinaryFileName = "gpt2";
		LLMBackendVariationFileSubFolder = "ggml-gpt2";
	}else if (LLMBackendSelection === "LLaMa2gguf"){
		LLMBackendVariationBinaryFileName = "llama-gguf";
		LLMBackendVariationFileSubFolder = "llama-gguf";
	}else if (LLMBackendSelection === "gemma"){
			LLMBackendVariationBinaryFileName = "gemma";
			LLMBackendVariationFileSubFolder = "googleGemma";
	}else if (LLMBackendSelection === "whisper"){
			LLMBackendVariationBinaryFileName = "whisper";
			LLMBackendVariationFileSubFolder = "whisper";
	}else {
		log.info(consoleLogPrefix, "Unsupported Backend", LLMBackendSelection);
        process.exit(1);
	}

	log.info(`Detected Platform: ${platform}`);
	log.info(`Detected Architecture: ${arch}`);
	log.info(`Detected LLMBackend: ${LLMBackendSelection}`);

	LLMBackendVariationSelected = `LLMBackend-${LLMBackendVariationBinaryFileName}`;

	if (platform === 'win32'){
		// Windows
		if(arch === 'x64'){
			log.info(consoleLogPrefix,`LLMChild Basebinary Detection ${basebin}`);
			basebinBinaryMoreSpecificPathResolve = `${LLMBackendVariationSelected}.exe`;
			basebin = `[System.Console]::OutputEncoding=[System.Console]::InputEncoding=[System.Text.Encoding]::UTF8; ."${path.resolve(__dirname, "bin", "1_Windows", "x64", LLMBackendVariationFileSubFolder, supportsAVX2 ? "" : "no_avx2", basebinBinaryMoreSpecificPathResolve)}"`;

		}else if(arch === 'arm64'){
			log.info(consoleLogPrefix,`LLMChild Basebinary Detection ${basebin}`);
			basebinBinaryMoreSpecificPathResolve = `${LLMBackendVariationSelected}.exe`;
			basebin = `[System.Console]::OutputEncoding=[System.Console]::InputEncoding=[System.Text.Encoding]::UTF8; ."${path.resolve(__dirname, "bin", "1_Windows", "arm64", LLMBackendVariationFileSubFolder, supportsAVX2 ? "" : "no_avx2", basebinBinaryMoreSpecificPathResolve)}"`;

		}else{
			log.error(consoleLogPrefix, "Unsupported Architecture");
            process.exit(1);
		}
	} else if (platform === 'linux'){
		if(arch === "x64"){
			basebinBinaryMoreSpecificPathResolve = `${LLMBackendVariationSelected}`;
			basebin = `"${path.resolve(__dirname, "bin", "2_Linux", "x64", LLMBackendVariationFileSubFolder, basebinBinaryMoreSpecificPathResolve)}"`;
		log.info(consoleLogPrefix,`LLMChild Basebinary Detection ${basebin}`);
		}else if(arch === "arm64"){
			basebinBinaryMoreSpecificPathResolve = `${LLMBackendVariationSelected}`;
			basebin = `"${path.resolve(__dirname, "bin", "2_Linux", "arm64", LLMBackendVariationFileSubFolder, basebinBinaryMoreSpecificPathResolve)}"`;
		log.info(consoleLogPrefix,`LLMChild Basebinary Detection ${basebin}`);
		}else{
			log.error(consoleLogPrefix, "Unsupported Architecture");
            process.exit(1);
	}
	// *nix (Linux, macOS, etc.)	
	} else if (platform === 'darwin'){
		if(arch === "x64"){
			basebinBinaryMoreSpecificPathResolve = `${LLMBackendVariationSelected}`;
			basebin = `"${path.resolve(__dirname, "bin", "0_macOS", "x64", LLMBackendVariationFileSubFolder, basebinBinaryMoreSpecificPathResolve)}"`;
		log.info(consoleLogPrefix, `LLMChild Basebinary Detection ${basebin}`);
		}else if(arch === "arm64"){
			basebinBinaryMoreSpecificPathResolve = `${LLMBackendVariationSelected}`;
			basebin = `"${path.resolve(__dirname, "bin", "0_macOS", "arm64", LLMBackendVariationFileSubFolder, basebinBinaryMoreSpecificPathResolve)}"`;
		log.info(consoleLogPrefix, `LLMChild Basebinary Detection ${basebin}`);
		}else{
			log.error(consoleLogPrefix, "Unsupported Architecture");
            process.exit(1);
		}
	}


	// Note this need to be able to handle spaces especially when you are aiming for Windows support which almost everything have spaces and everything path is inverted, its an hell for developer natively support 99% except Windows Fuck microsoft
	basebin = basebin.replace(" ","\ ");
	log.info(consoleLogPrefix, "Base Binary Path", basebin);

	return basebin;
}

//we're going to define basebin which define which binary to use
determineLLMBackend();
log.info(consoleLogPrefix, process.versions.modules);
const pty = require("node-pty");
const { Console } = require("console");
const { isWhiteSpaceLike } = require("typescript");
var runningShell, currentPrompt;
var zephyrineReady,
	zephyrineHalfReady = false;
var checkAVX,
	isAVX2 = false;


// Initialization of the Array
//-------------------------------------------
let interactionStg = []; // Interaction from the GUI Storage (Classic Depth Fetching Memory)
// for MLCMCF refer back to "Basic Building Block of Adelaide Paradigm.drawio" Multi Level Condensed Memory Contextual Fetching tabs section

let interactionSessionMemoryArrayFocus=0;
// Interaction Session need to be defined Globally and if there a switch then iit is required to switch the interaction storage Focus

// if interactionStg 
const initInteractionStgContentTemplate = {
    "session-id": interactionSessionMemoryArrayFocus,
    "name": "Initial Interaction Storage",
    "data": [
        {"content": "PlaceHolder0", "role": username, "emotion": "happy"},
        {"content": "PlaceHolder1", "role": assistantName, "emotion": "happy"},
		{"content": "PlaceHolder2", "role": assistantName, "emotion": "happy"},
		{"content": "PlaceHolder3", "role": assistantName, "emotion": "happy"},
		{"content": "PlaceHolder4", "role": assistantName, "emotion": "happy"},
		{"content": "PlaceHolder5", "role": assistantName, "emotion": "happy"}
    ]
};
interactionStg.push(initInteractionStgContentTemplate); //Pushing the template
log.debug(consoleLogPrefix, "Pushing InteractionSTG Template!!!")
/*
Manual on how to use this

// Session Title
interactionStg[0].name ?

// Session ID
interactionStg[0].session-id ?

// Content
interactionStg[0].data[interactionArray (from 0)].content ?
// What side?
interactionStg[0].data[interactionArray (from 0)].role ?
// emotion 
interactionStg[0].data[interactionArray (from 0)].emotion ?

// How does it look on multi session interaction?

		ToDo : Please rewrite the storage into this kind of stuff to prepare multi-session interaction

		interactionStg = [
    {
        "session-id": "1234567890",
        "name": "Session Interaction Storage",
        "data": [
            {"content": "...[YOUR SYSTEM PROMPT]...", "role": "system", "emotion": "happy"},
            {"content": "...[YOUR QUESTIONS]...", "role": "user", "emotion": "happy"},
            {"content": "...[YOUR EXPECTED ANSWER]...", "role": "assistant", "emotion": "happy"}
        ]
    },
    {
        "session-id": "6969699",
        "name": "Another one",
        "data": [
            {"content": "...[YOUR SYSTEM PROMPT]...", "role": "system", "emotion": "happy"},
            {"content": "...[YOUR QUESTIONS]...", "role": "user", "emotion": "happy"},
            {"content": "...[YOUR EXPECTED ANSWER]...", "role": "assistant", "emotion": "happy"}
        ]
    }
];

*/
//-------------------------------------------



// UnifiedMemoryArray will be stored on experience folder and will be deduplicated every runtime
let UnifiedMemoryArray = []; // MLCMCF Multi Level Condensed Memory Contextual Fetching Architecture Unified memory Array
// UMA minimum and the runtime can handle 7 Billion Arrays and should scale up to 1 Trillion Arrays. NO EXCEPTION!

let UMAGBSize=0; //Global variable on how many gigs does the UMA takes on the runtime

let interactionStgJson;
let interactionStgPersistentPath = `${path.resolve(__dirname, "storage", "presistentInteractionMem.json")}`;
let experienceStgPersistentPath = `${path.resolve(__dirname, "storage", "UMA_State.json")}`;
let experienceSideloadFolder = `${path.resolve(__dirname, "storage", "experiencesideload_dataset")}`;
let experienceSideload_Loaded = false; // globally and only triggered once
let interactionStgOrder = 0;
let retrievedinteractionStg;
let interactionStgOrderRequest;
let amiwritingonAIMessageStreamMode=false;
function interactionArrayStorage(mode, prompt, AITurn, UserTurn, arraySelection){
	//

	//proactive UnifiedMemoryArray Management System
	//------------------------------------------------------------------------------------------------------

	// Initialize Unified Memory Array if this function called and its still blank
	// Check if UnifiedMemoryArray is empty or undefined

    //restore old UnifiedMemoryArray if foreverEtchedMemory turned on or true (it is now integrated with the load call for this function)


	// Deduplicate 

	// Calculate GB UMA Usage
	//UMAGBSize = calculateMemoryUsageInGB(UnifiedMemoryArray);
	UMAGBSize = `${process.memoryUsage().heapUsed / (1024 * 1024 * 1024)}`
	//debug on what is the content of UnifiedMemoryArray
	// Comment this debug message when its done
	//log.info(consoleLogPrefix, "Debug UnifiedMemoryArray Content", UnifiedMemoryArray)
	//------------------------------------------------------------------------------------------------------

	if (mode === "save"){
        log.debug(consoleLogPrefix,"[Storage Manager]", "Save Invoked!", "Order???", interactionStgOrder, "Content array stg mainLLM", interactionStg, "recievedData", prompt, "SaveSwitchInteraction", AITurn, UserTurn);
		if(AITurn && !UserTurn){

		//reform AITurn to be not partial but its going to recieve the whole chunk (in one time) now
			/*
			if(!amiwritingonAIMessageStreamMode){
				interactionStgOrder = interactionStgOrder + 1;
				 // add the order number counter when we detect we did write it on AI mode and need confirmation, when its done we should add the order number
				log.debug(consoleLogPrefix, "Debug Unifying User Turn Interactiong stg");
				log.debug(consoleLogPrefix, "Debug UserTurn Interaction json format", interactionStg[interactionSessionMemoryArrayFocus].data);
				UnifiedMemoryArray.push(prompt);
			}
			amiwritingonAIMessageStreamMode=true;
			
			if (process.env.ptyinteractionStgDEBUG === "1"){
				log.debug(consoleLogPrefix, "Entering the interactionStg Order array json focus scheme, this is where i'm going to get stuck without error")
			}
			if (!interactionStg[interactionSessionMemoryArrayFocus].data[interactionStgOrder]){
				log.error("Prop doesn't exist yet!");
				interactionStg[interactionSessionMemoryArrayFocus].data[interactionStgOrder]={"content": ``, "role": "UNK", "emotion": "UNK"}
				log.error("Scheme has been initialized", interactionStg[interactionSessionMemoryArrayFocus].data[interactionStgOrder]);
			}

			
			//interactionStgOrder = interactionStgOrder + 1; //we can't do this kind of stuff because the AI stream part by part and call the  in a continuous manner which auses the interactionStgOrder number to go up insanely high and mess up with the storage
			// How to say that I'm done and stop appending to the same array and move to next Order?
			//interactionStg[interactionStgOrder] += prompt; //handling the partial stream by appending into the specific array
			//interactionStg[interactionStgOrder] = interactionStg[interactionStgOrder].replace("undefined", "");
			
			//Since we are using the second revision on how to store messages on json, we got an educational training from AI engineer from a company on the standard training data, we could use that as a basis on how to do this, see at the initial function comment for details
			
			
			const resultAIPartialStream=prompt // this one is recieving AI result generation
			// Slowly reconstruct on the .content property
			if (process.env.ptyinteractionStgDEBUG === "1"){
				log.debug(consoleLogPrefix, "Catching AI Buffer!", resultAIPartialStream)
			}
			interactionStg[interactionSessionMemoryArrayFocus].data[interactionStgOrder].emotion = emotionalEvaluationResult
			interactionStg[interactionSessionMemoryArrayFocus].data[interactionStgOrder].role = assistantName
			interactionStg[interactionSessionMemoryArrayFocus].data[interactionStgOrder].content += resultAIPartialStream;
			// Writing on the thing
			if (process.env.ptyinteractionStgDEBUG === "1"){
				log.info(consoleLogPrefix,"AITurn...");
				log.info(consoleLogPrefix, "reconstructing from pty stream: ", interactionStg[interactionSessionMemoryArrayFocus].data[interactionStgOrder]);
			}
			*/
			// Its as simple as this, don't need special handler for partial stream or smth
			log.debug(consoleLogPrefix, "Pushing Prompt to new restoration Dictionary data");
			log.debug(consoleLogPrefix, "Pushing Prompt to new restoration Dictionary data", "Array Session Focus", interactionSessionMemoryArrayFocus, "interactionStgOrder", interactionStgOrder);
			if (!interactionStg[interactionSessionMemoryArrayFocus].data[interactionStgOrder]){
				log.error("Prop doesn't exist yet!");
				interactionStg[interactionSessionMemoryArrayFocus].data[interactionStgOrder]={"content": ``, "role": "UNK", "emotion": "UNK"}
				log.error("Scheme has been initialized", interactionStg[interactionSessionMemoryArrayFocus].data[interactionStgOrder]);
			}
			log.debug(consoleLogPrefix, "Storage Session Focus Length Interaction", "Prepraring");
			log.debug(consoleLogPrefix, "Storage Session Focus Length Interaction", interactionStg[interactionSessionMemoryArrayFocus].data.length)
			log.debug(consoleLogPrefix, "current pty stream capture interactionStg", interactionStg[interactionSessionMemoryArrayFocus].data[interactionStgOrder]);
			log.debug(consoleLogPrefix, "Entering the interactionStg Order array json focus scheme, this is where i'm going to get stuck without error")
			
			interactionStgOrder = interactionStgOrder + 1;
			log.debug(consoleLogPrefix, "emotionalEvalResult save");
			interactionStg[interactionSessionMemoryArrayFocus].data[interactionStgOrder].emotion = emotionalEvaluationResult;
			log.debug(consoleLogPrefix, "assistantName save");
			interactionStg[interactionSessionMemoryArrayFocus].data[interactionStgOrder].role = assistantName;
			log.debug(consoleLogPrefix, "content save");
			interactionStg[interactionSessionMemoryArrayFocus].data[interactionStgOrder].content = prompt;

		}

		if(!AITurn && UserTurn){
			amiwritingonAIMessageStreamMode=false;
			interactionStgOrder = interactionStgOrder + 1;
			log.debug(consoleLogPrefix, "Pushing Prompt to new restoration Dictionary data", "Array Session Focus", interactionSessionMemoryArrayFocus, "interactionStgOrder", interactionStgOrder);
			log.debug(consoleLogPrefix, "Storage Session Data Currently Content", interactionStg[interactionSessionMemoryArrayFocus].data);
			if (!interactionStg[interactionSessionMemoryArrayFocus].data[interactionStgOrder]){
				log.error("Prop doesn't exist yet!");
				interactionStg[interactionSessionMemoryArrayFocus].data[interactionStgOrder]={"content": ``, "role": "UNK", "emotion": "UNK"}
				log.error("Scheme has been initialized", interactionStg[interactionSessionMemoryArrayFocus].data[interactionStgOrder]);
			}
			log.debug(consoleLogPrefix, "Storage Session Focus Length Interaction", "Prepraring");
			log.debug(consoleLogPrefix, "Storage Session Focus Length Interaction", interactionStg[interactionSessionMemoryArrayFocus].data.length)
			log.debug(consoleLogPrefix, "current pty stream capture interactionStg", interactionStg[interactionSessionMemoryArrayFocus].data[interactionStgOrder]);
			log.debug(consoleLogPrefix, "Entering the interactionStg Order array json focus scheme, this is where i'm going to get stuck without error")

			
			// this one is recieving User OG prompt
			//interactionStg[interactionStgOrder] = prompt;
			log.debug(consoleLogPrefix, "emotionalEvalResult save");
			interactionStg[interactionSessionMemoryArrayFocus].data[interactionStgOrder].emotion = emotionalEvaluationResult;
			log.debug(consoleLogPrefix, "assistantName save");
			interactionStg[interactionSessionMemoryArrayFocus].data[interactionStgOrder].role = username;
			log.debug(consoleLogPrefix, "content save");
			interactionStg[interactionSessionMemoryArrayFocus].data[interactionStgOrder].content = prompt;
			if (process.env.ptyinteractionStgDEBUG === "1"){
				log.debug(consoleLogPrefix,"UserTurn...");
				log.debug(consoleLogPrefix, "stg pty stream user:", interactionStg[interactionSessionMemoryArrayFocus].data[interactionStgOrder]);
			}
			
			log.debug(consoleLogPrefix, "Debug Unifying User Turn Interactiong stg");
			UnifiedMemoryArray.push(prompt);
			
		}
		if (process.env.ptyinteractionStgDEBUG === "1"){
		log.debug(consoleLogPrefix,"interactionStgOrder...", interactionStgOrder);
		log.debug(consoleLogPrefix,"interactionStg Content", interactionStg);
		}


		log.debug(consoleLogPrefix,"interactionStg Content", interactionStg);
			// dedupe content on UnifiedMemoryArray to save storage proactively
		//log.info(consoleLogPrefix, "Debug Dedupe UnifiedMemoryArray Content");
		// Iterate over each array in UnifiedMemoryArray
		/*
		UnifiedMemoryArray.forEach((array, index) => {
			// Check if the current element is an array
			if (Array.isArray(array)) {
				// Convert the array to a Set to remove duplicates
				const uniqueSet = new Set(array);
				// Convert the Set back to an array and assign it to UnifiedMemoryArray
				UnifiedMemoryArray[index] = [...uniqueSet];
			}
		});
		*/
		log.debug(consoleLogPrefix, "Debug Dedupe UnifiedMemoryArray Content");
		UnifiedMemoryArray = Array.from(new Set(UnifiedMemoryArray));
		log.debug(consoleLogPrefix, "Debug Dedupe UnifiedMemoryArray Content");




		// Checking storage whether it was a bad seed or not
		// log.error("Im here and stuck");
		if (interactionStgOrder >= 2){

		log.debug(consoleLogPrefix, "Checking Signature for Bad Output...");
		const detector = new DPORuntimeAutomator(prompt, interactionStgOrder);
		// log.error("Eh?");
		detector.badSignatureDetection();
	}
		log.debug("Birds are born without shackles");
		log.debug("Then what fetters my fate?");
		log.debug("Blown away, the white petals");
		log.debug("Leave me trapped in the cage");
		
		
    }else if (mode === "retrieve_MLCMCF_Mode"){
		let MLCMCF_Match_threshold=0.69 // Below this MLCMCF match threshold causes it to break and worsen the output. Now why i chose 0.69? Well its simply because its nice ;)
		const limitCharacterOutput=512; //put the limit 512 later on if its not enough the LLMChild can re-retrieve back what's required from MLCMCF iteratively
		log.info(consoleLogPrefix,"Calling \"Unified Memory Array\" Target: ", `${prompt}`, arraySelection);

		// Just directly connect to all of it
		// do natural language processing cosine similiarity
		// Trim the shit out of it
		// done profit!
		// Returns with Array format that uses Natural Language to find which is the highest possibility picked as the middle array then delta +- with arrayselection as the depth seeker
		//const delta = arraySelection; // convert to delta variable locally
		//const string = prompt;
		// Search for string in UnifiedMemoryArray
		// 1. Receive a "string" "array Delta number value"
		
		let maxScore;
		let maxIndex;
		let selectedChunkIndex;
		const queryString = `${prompt}`;
		const delta = arraySelection;
	    // log.debug("Igniting MLCMCF", UnifiedMemoryArray);
		// 2. Search "string" in the array of variable UnifiedMemoryArray to find the string using NLP and select the index with highest value of similarity.

		maxScore = 0;
		maxIndex = 0;

		for (let idx = 0; idx < UnifiedMemoryArray.length; idx++) {
			const text = UnifiedMemoryArray[idx];
			// Skip non-textual or non-meaningful strings
			const nonTextualRegex = /^=+\s*UnifiedMemoryArrayHeader\s*=+$/;
			if (nonTextualRegex.test(text)) {
				continue;
			}
		
			// log.debug("Scoring Index MLCMCF Normalizing array?");
			const distance = natural.JaroWinklerDistance(queryString, text); //Its my Cosine Distance 
			// log.debug("Scoring Index MLCMCF Jaro-winkler Standard non Tokenizer Mode!", distance);
			// Update maxScore and maxIndex if the distance is higher
			if (distance > maxScore) {
				maxScore = distance;
				maxIndex = idx;
			}
		}
		
		// log.debug("Max Score:", maxScore);
		// log.debug("Max Index:", maxIndex);
		selectedChunkIndex = maxIndex;
		// 3. Copy the selected index with from index to index-(delta number value) (Backwards) also index+(delta number value) forward into a variable array.
		log.debug("Defining L1 UMA array FullLength");
		let L1_focusedUMAArrayFullLength = [];
		// Push to L1_focusedUMAArrayFullLength for every string got fetch into the .length

		//for loop backward
		log.debug("Pushing L1 Back");
		for (let idx = selectedChunkIndex; idx >= 0 && Math.abs(selectedChunkIndex-idx) <= delta; idx--) {
			L1_focusedUMAArrayFullLength.push(UnifiedMemoryArray[idx]);
		}

		// log.debug("Pushing L1 Mid");
		// Middle part of the Selection
		L1_focusedUMAArrayFullLength.push(UnifiedMemoryArray[selectedChunkIndex]);

		// log.debug("Pushing L1 Top");
		//for loop forward
		for (let idx = selectedChunkIndex; idx < UnifiedMemoryArray.length && Math.abs(selectedChunkIndex-idx) <= delta; idx++) {
			L1_focusedUMAArrayFullLength.push(UnifiedMemoryArray[idx]);
		}

		log.debug(consoleLogPrefix, "MLCMCF L1 Full Length", L1_focusedUMAArrayFullLength)
		
	  
		// 4. That variable array then divide and skip part where the array is under 256 characters but if the array is more than 256 characters then split it. Then all of this processing where there is the splitted and the unsplitted array store it into variable L1_focusedUMAArrayChunk (already defined)
		// Chunk will be divided using Tokens
		
		/*
			example on how to do tokenizing
			const textTokens = nlp(text).normalize().out('array');
			const queryTokens = nlp(queryString).normalize().out('array');
			NOTE : THE INPUT NEED TO BE IN STRING NOT IN ARRAY
		*/


		let L1_focusedUMAArrayChunk = [];
		log.debug('converting L1_focusedUMAArrayFullLength to L1_focusedUMAArrayFullLength', L1_focusedUMAArrayChunk, L1_focusedUMAArrayFullLength);
		
		log.debug(consoleLogPrefix, "dedupe result L1");
		L1_focusedUMAArrayChunk = nlp(L1_focusedUMAArrayFullLength.join(' ').slice(0, limitCharacterOutput)).normalize().out('array').map((phrase) => {
		let words = phrase.split(' '); // Split the phrase into words
		let uniqueWords = [...new Set(words)]; // Remove duplicate words
		return uniqueWords.join(' '); // Join the unique words back into a phrase
		});
		log.debug(consoleLogPrefix, "dedupe result L1_ack", L1_focusedUMAArrayChunk);

		//L1_focusedUMAArrayChunk = nlp(L1_focusedUMAArrayFullLength.join(' ').slice(0, limitCharacterOutput)).normalize().out('array'); //Tokenize it rather than cut it without context

		// 5. That variable array then calculate and find with the "string" that been given earlier with the compromise module to find the string using NLP then select the array index that have the highest similarity score. After that fetch the selected index with from index to index-(delta number value) (Backwards) also index+(delta number value) forward into a variable array named L2_focusedUMAArrayChunkDelta (already defined).
		let L2_focusedUMAArrayChunkDelta = [];
		log.debug('L2 Reset Memory Storage, Entering Checking For Loop');
		maxScore = 0;
		maxIndex = 0;
		for (let idx = 0; idx < L1_focusedUMAArrayChunk.length; idx++) {
			const text = L1_focusedUMAArrayChunk[idx];
			// Skip non-textual or non-meaningful strings
			const nonTextualRegex = /^=+\s*UnifiedMemoryArrayHeader\s*=+$/;
			if (nonTextualRegex.test(text)) {
				continue;
			}
		
			// log.debug("Scoring Index MLCMCF Normalizing array?");
			const distance = natural.JaroWinklerDistance(queryString, text); //Its my Cosine Distance 
			// log.debug("Scoring Index MLCMCF Jaro-winkler Standard non Tokenizer Mode!", distance);
			// Update maxScore and maxIndex if the distance is higher
			if (distance > maxScore) {
				maxScore = distance;
				maxIndex = idx;
			}
		}
		
		// log.debug("Max Score:", maxScore);
		// log.debug("Max Index:", maxIndex);
		selectedChunkIndex = maxIndex


		//for loop backward

		for (let idx = selectedChunkIndex; idx >= 0 && Math.abs(selectedChunkIndex-idx) <= delta; idx--) {
			L2_focusedUMAArrayChunkDelta.push(L1_focusedUMAArrayChunk[idx]);
		}

		// Middle part of the Selection
		L2_focusedUMAArrayChunkDelta.push(L1_focusedUMAArrayChunk[selectedChunkIndex]);

		//for loop forward
		for (let idx = selectedChunkIndex; idx < L1_focusedUMAArrayChunk.length && Math.abs(selectedChunkIndex-idx) <= delta; idx++) {
			L2_focusedUMAArrayChunkDelta.push(L1_focusedUMAArrayChunk[idx]);
		}

		if ( maxScore <= MLCMCF_Match_threshold ){
			log.error(consoleLogPrefix, "UMA No Matching Content that have the minima quality", maxScore, "<", MLCMCF_Match_threshold);
			L2_focusedUMAArrayChunkDelta=[""];
		}
		
		log.debug(consoleLogPrefix, "MLCMCF L2 Focused Retrieved Array", L2_focusedUMAArrayChunkDelta);
		log.debug(consoleLogPrefix, "UMA Retrieval Peaked Score", maxScore);
		return L2_focusedUMAArrayChunkDelta;


    } else if (mode === "retrieve"){
		log.info(consoleLogPrefix,"retrieving Interaction Storage Order ", arraySelection);
		if (arraySelection >= 1 && arraySelection <= interactionStgOrder && interactionStgOrder <= 2)
        {
		//retrievedinteractionStg = interactionStg[arraySelection];
		retrievedinteractionStg = interactionStg[interactionSessionMemoryArrayFocus].data[arraySelection].content
		} else {
			retrievedinteractionStg = "";
		}

		
		return retrievedinteractionStg;

    } else if (mode === "restoreLoadPersistentMem"){
		if (store.get("params").SaveandRestoreInteraction) {
			log.info(consoleLogPrefix, "Restoring Interaction Context... Reading from File to Array");
			interactionStgOrder = 0;
			try {
				const data = fs.readFileSync(interactionStgPersistentPath, 'utf8');
				const jsonData = JSON.parse(data);
				log.info(consoleLogPrefix, "Interpreting JSON and Converting to Array");
				interactionStg = jsonData;
				interactionStgOrder = interactionStgOrder + interactionStg.length;
				//log.info(consoleLogPrefix, "Loaded dddx: ", interactionStg, interactionStgOrder);
			} catch (err) {
				log.error('Error reading JSON file:', err);
				interactionStg.push(initInteractionStgContentTemplate);
				log.error('Falling back to default Storage:', interactionStg);
				log.error('Debug memory dump bugcheck Memory Array Focus:', interactionStg[interactionSessionMemoryArrayFocus]);
				log.error('Debug memory dump bugcheck Memory Array Content Data:', interactionStg[interactionSessionMemoryArrayFocus].data);
				return;
			}
		
			log.debug(consoleLogPrefix, "Loaded: ", interactionStg, interactionStgOrder);
			log.debug(consoleLogPrefix, "Loaded Focused Session: ", interactionSessionMemoryArrayFocus, "content:", interactionStg[interactionSessionMemoryArrayFocus].data);
			log.debug(consoleLogPrefix, "Triggering Restoration Mode for the UI and main LLM Thread!");
			// create a javascript for loop logic to send data to the main UI which uses odd order for the User input whilst even order for the AI input (this may fail categorized when the user tried change ) where the array 0 skipped and 1 and beyond are processed
			
			// change the length detection from interactionStg.length to interactionStg[interactionSessionMemoryArrayFocus].data.length
			for (let i = 1; i < interactionStg[interactionSessionMemoryArrayFocus].data.length; i++) {
				// Check if the index is odd (user input message)
				// PFFFT this is old, lets use the more legitimate complicated JSON that have multiple properties whether it is from the user or not
				/*
				interactionStg = [
					{
						"session-id": "1234567890",
						"name": "Session Interaction Storage",
						"data": [
							{"content": "...[YOUR SYSTEM PROMPT]...", "role": "system", "emotion": "happy"},
							{"content": "...[YOUR QUESTIONS]...", "role": "user", "emotion": "happy"},
							{"content": "...[YOUR EXPECTED ANSWER]...", "role": "assistant", "emotion": "happy"}
						]
					}
				*/
				if (interactionStg[interactionSessionMemoryArrayFocus].data[i].role == username) {
					// Posting the message for the user side into the UI
					log.debug("User input message:", interactionStg[i]);
					const dataTextInteractionForwarding=interactionStg[interactionSessionMemoryArrayFocus].data[i].content;
					const dataTextInteractionEmotion=interactionStg[interactionSessionMemoryArrayFocus].data[i].emotion;
					win.webContents.send("manualUserPromptGUIHijack", {
						data: {"interactionTextData": dataTextInteractionForwarding, "emotion": dataTextInteractionEmotion}
					});
				} else if (interactionStg[interactionSessionMemoryArrayFocus].data[i].role == assistantName){ // Even index (servant input message)
					// Posting the message for the AI side into the UI
					log.debug("Servant input message:", interactionStg[i]);
					const dataTextInteractionForwarding=interactionStg[interactionSessionMemoryArrayFocus].data[i].content;
					const dataTextInteractionEmotion=interactionStg[interactionSessionMemoryArrayFocus].data[i].emotion;
					win.webContents.send("manualAIAnswerGUIHijack", {
						data: {"interactionTextData": dataTextInteractionForwarding, "emotion": dataTextInteractionEmotion}
					});
				}
			}
			// Read into the UMA -<
			if (store.get("params").foreverEtchedMemory) {
				// log.debug(consoleLogPrefix, "foreverEtchedMemory parameters enabled");
				let data;
				if (fileExists(experienceStgPersistentPath)){
					data = fs.readFileSync(experienceStgPersistentPath, 'utf8');
				}else{
					data = false;
				}
					if (!data) {
						// File is empty, assign an empty array to UnifiedMemoryArray
						log.error(consoleLogPrefix, "UnifiedMemoryArray file is empty");
						UnifiedMemoryArray = [];
					} else {
						const jsonData = JSON.parse(data);
						log.info(consoleLogPrefix, "Interpreting JSON and Converting to Array");
						UnifiedMemoryArray = jsonData;
						log.info(consoleLogPrefix, "UMA state has been loaded!");
						log.debug(consoleLogPrefix, "Loaded UMA: ", UnifiedMemoryArray);
					}
			}

			//sideload Experience into UMA
			log.debug("checking sideload exp param [bugcheck this part]", store.get("params").sideloadExperienceUMA);

			if (store.get("params").sideloadExperienceUMA) {
				//
				log.info(consoleLogPrefix, "Loading experience file into UMA"); // Lockup detected after this log info March 29, 2024, conclusion : BRUH the problem was caused by me mistyping of the directory from experiencesideload_dataset to mistyped experiencessideload_dataset 
				//recursively scan Folder variable experienceSideloadFolder for .exp file and read it as plain text file and concatenate it into one long string
				let concatenatedString = '';
				function scanDirectory(dir) {

					const files = fs.readdirSync(dir);
					files.forEach(file => {
						const filePath = path.join(dir, file);
						const stat = fs.statSync(filePath);
						log.debug(consoleLogPrefix, "Loading experience file into UMA entity", filePath);
						if (stat.isDirectory()) {
							scanDirectory(filePath);
						} else {
							if (path.extname(file) === '.exp') {
								const fileContent = fs.readFileSync(filePath, 'utf-8');
								concatenatedString += fileContent;
							}
						}
					});
				}
				scanDirectory(experienceSideloadFolder);
				log.info(consoleLogPrefix, "Done... Pushing to UMA!");
				UnifiedMemoryArray.push(concatenatedString);
				log.debug(consoleLogPrefix, "Loaded UMA With Sideloaded Experience: ");
			}

			log.info(consoleLogPrefix, "Done!");
		} else {
			log.info(consoleLogPrefix, "Save and Restore Chat Disabled");
		}

		// then after that set to the appropriate interactionStgOrder from the header of the file
	} else if (mode === "reset"){
		log.info(consoleLogPrefix, "Resetting Temporary Storage Order and Overwriting to Null!");
		interactionStgOrder=0;
		interactionStg = initInteractionStgContentTemplate;
		
	} else if (mode === "flushPersistentMem"){
		const debugPrefix="[FlushDebug]"
		if (store.get("params").SaveandRestoreInteraction) {
			//example of the directory writing 
			//basebin = `"${path.resolve(__dirname, "bin", "2_Linux", "arm64", LLMBackendVariationFileSubFolder, basebinBinaryMoreSpecificPathResolve)}"`;
			log.debug(consoleLogPrefix, debugPrefix, "Flushing context into disk!");
			log.debug(consoleLogPrefix, debugPrefix, interactionStg);
			interactionStgJson = JSON.stringify(interactionStg)
			log.debug(consoleLogPrefix, debugPrefix, interactionStgJson);
			log.debug(consoleLogPrefix, debugPrefix, interactionStgPersistentPath)
			fs.writeFile(interactionStgPersistentPath, interactionStgJson, (err) => {
				if (err) {
				log.info(consoleLogPrefix, 'Error writing file:', err);
				}
			});
			// write from the UMA ->
			// Dump all the UnifiedMemoryArray if foreverEtchedMemory turned on or true store.get("params").foreverEtchedMemory
			if (store.get("params").foreverEtchedMemory){
				const UMAJSON = JSON.stringify(UnifiedMemoryArray)
					//log.info(consoleLogPrefix, interactionStgJson);
					fs.writeFile(experienceStgPersistentPath, UMAJSON, (err) => {
						if (err) {
						log.info(consoleLogPrefix, 'Error writing file:', err);
						}
					});
			}
			return "";
		}
	} else if (mode === "resetPersistentStorage") {
		if (store.get("params").SaveandRestoreInteraction) {
			interactionStgJson = ""
			log.info(consoleLogPrefix, "Chat History Backend has been Reset!")
			fs.writeFile(interactionStgPersistentPath, interactionStgJson, (err) => {
				if (err) {
				log.info(consoleLogPrefix, 'Error writing file:', err);
				}
			});
			return "";
		}
	} else {
		log.info(consoleLogPrefix, "Save and Restore Chat disabled!")
	}
	
}

function calculateMemoryUsageInGB(array) {
    // Get the size of each element in bytes
    const elementSizeInBytes = 8; // Assuming each element is a double-precision float (8 bytes)

    // Get the length of the array
    const length = array.length;

    // Calculate the total memory usage in bytes
    const totalMemoryInBytes = elementSizeInBytes * length;

    // Convert bytes to gigabytes
    const totalMemoryInGB = totalMemoryInBytes / (1024 * 1024 * 1024); // 1 GB = 1024^3 bytes

    return totalMemoryInGB;
}



if (store.get("supportsAVX2") == undefined) {
	store.set("supportsAVX2", true);
}
var supportsAVX2 = store.get("supportsAVX2");
const config = {
	name: "xterm-color",
	cols: 69420,
	rows: 30
};

const shell = platform === "win32" ? "powershell.exe" : "bash";

const stripAdditionalContext = (str) => {
	const regex = /\[AdditionalContext\]_{16,}.*?\[AdditionalContext\]_{16,}/g; //or you could use the variable and add * since its regex i actually forgot about that
	//const pattern = [];
	//const regex = new RegExp(pattern, "g");
	return str.replace(regex, "")
}

function restart() {
	log.info(consoleLogPrefix, "Resetting Main LLM State and Storage!");
	win.webContents.send("result", {
		data: "\n\n<end>"
	});
	if (runningShell) runningShell.kill();
	runningShell = undefined;
	currentPrompt = undefined;
	zephyrineReady = false;
	zephyrineHalfReady = false;
	("flushPersistentMem", 0, 0, 0, 0); // Flush function/method test
	interactionArrayStorage("reset", 0, 0, 0, 0); // fill it with 0 0 0 0 just to fill in nonsensical data since its only require reset command to execute the command
	initChat();
}


//const splashScreen = document.getElementById('splash-screen-overlay'); //blocking overlay which prevent person and shows peopleexactly that the bot is loading
let blockGUIForwarding;
let initChatContent;
let isitPassedtheFirstPromptYet;
let params = store.get("params");
let RAGPrepromptingFinished=true;
let mainLLMFinishedGeneration=false;
let messageRecievedOrder = 0;

log.info(consoleLogPrefix, "entering primed mode")
function initChat() {
	if (runningShell) {
		win.webContents.send("ready");
		log.info(consoleLogPrefix, "LLMMain Thread Ready");
		blockGUIForwarding = false;
		return;
	}
	const ptyProcess = pty.spawn(shell, [], config);
	runningShell = ptyProcess;
	interactionArrayStorage("restoreLoadPersistentMem", 0, 0, 0, 0); // Restore Array Chat context
	ptyProcess.onData(async (res) => {
		res = stripProgramBreakingCharacters(res);
		log.debug("[CORE MainLLM DEBUG RAW FlipFlop I/O]:",res);
		log.debug("[CORE MainLLM DEBUG RAW Switch]:", "zephyrineHalfReady",zephyrineHalfReady, "zephyrineReady",zephyrineReady, "blockGUIForwarding", blockGUIForwarding, "RAGPrepromptingFinished", RAGPrepromptingFinished);
		//res = stripAdditionalContext(res);
		if (process.env.ptyStreamDEBUGMode === "1"){
		log.info(consoleLogPrefix, "pty Stream",`//> ${res}`);
		log.info(consoleLogPrefix, "debug", zephyrineHalfReady, zephyrineReady);
		}
		if ((res.includes("invalid model file") || res.includes("failed to open") || (res.includes("failed to load model")) && res.includes("main: error: failed to load model")) || res.includes("command buffer 0 failed with status 5") /* Metal ggml ran out of memory vram */ || res.includes ("invalid magic number") || res.includes ("out of memory")) {
			if (runningShell) runningShell.kill();
			//log.info(consoleLogPrefix, res);
			await prepareDownloadModel()
			//win.webContents.send("modelPathValid", { data: false });
		} else if (res.includes("\n>") && !zephyrineReady) {
			zephyrineHalfReady = true;
			log.info(consoleLogPrefix, "LLM Main Thread is ready after initialization!");
			isitPassedtheFirstPromptYet = false;
			if (store.get("params").throwInitResponse){
				NeuralAcceleratorEngineBusyState=true;
				log.info(consoleLogPrefix, "Blocking Initial Useless Prompt Response!");
				blockGUIForwarding = true;
				initChatContent = initStage2;
				runningShell.write(initChatContent);
				runningShell.write(`\r`);
				NeuralAcceleratorEngineBusyState=false;
			}
		//	splashScreen.style.display = 'flex';
		} else if (zephyrineHalfReady && !zephyrineReady) {
			//when alpaca ready removes the splash screen
			log.info(consoleLogPrefix, "LLM Main Thread is ready!")
			//splashScreen.style.display = 'none';
			zephyrineReady = true;
			checkAVX = false;
			win.webContents.send("ready");
			log.info(consoleLogPrefix, "Time to generate some Text!");
			NeuralAcceleratorEngineBusyState=false;
		} else if (((res.startsWith("llama_model_load:") && res.includes("sampling parameters: ")) || (res.startsWith("main: interactive mode") && res.includes("sampling parameters: "))) && !checkAVX) {
			checkAVX = true;
			log.info(consoleLogPrefix, "checking avx compat");
		} else if (res.match(/PS [A-Z]:.*>/) && checkAVX) {
			log.info(consoleLogPrefix, "avx2 incompatible, retrying with avx1");
			if (runningShell) runningShell.kill();
			runningShell = undefined;
			currentPrompt = undefined;
			zephyrineReady = false;
			zephyrineHalfReady = false;
			supportsAVX2 = false;
			checkAVX = false;
			store.set("supportsAVX2", false);
			initChat();
		} else if (((res.match(/PS [A-Z]:.*>/) && platform == "win32") || (res.match(/bash-[0-9]+\.?[0-9]*\$/) && platform == "darwin") || (res.match(/([a-zA-Z0-9]|_|-)+@([a-zA-Z0-9]|_|-)+:?~(\$|#)/) && platform == "linux")) && zephyrineReady) {
			restart();
		} else if ((res.includes("\n>") || res.includes("\n> ") || res.includes("> ") || res.includes(" \n> ") || res.includes("\n\n> ") || res.includes("\n>\n")) && zephyrineReady && !blockGUIForwarding) {
			log.info(consoleLogPrefix, "Done Generating and Primed to be Generating");
			if (store.get("params").throwInitResponse && !isitPassedtheFirstPromptYet){
				log.info(consoleLogPrefix, "Passed the initial Uselesss response initialization state, unblocking GUI IO");
				blockGUIForwarding = false;
				isitPassedtheFirstPromptYet = true;
			}
			if(RAGPrepromptingFinished){
			win.webContents.send("result", {
				data: "\n\n<end>"
			});
			mainLLMFinishedGeneration=true;
			log.debug(consoleLogPrefix, "mainLLMFinishedGeneration!!!!!!")
			}
		} else if (zephyrineReady && !blockGUIForwarding) { // Forwarding to pty Chat Stream GUI 
			if (platform == "darwin") res = res.replaceAll("^C", "");
			if (process.env.ptyStreamDEBUGMode === "1"){
			log.debug(consoleLogPrefix, "Forwarding to GUI...", res); // res will send in chunks so we need to have a logic that reconstruct the word with that chunks until the program stops generating
			}
			NeuralAcceleratorEngineBusyState=true; // When it is intensely use, say globally that it is used and not be able to allocated by something else
			//interactionArrayStorage(mode, prompt, AITurn, UserTurn, arraySelection)
			// Migrated to ipcMain.on("saveAdelaideEngineInteraction", (_event, resultData) => {} (To Compensate sudden multi-reply)
			//interactionArrayStorage("save", res, true, false, 0);	// for saving you could just enter 0 on the last parameter, because its not really matter anyway when on save data mode
			//interactionArrayStorage("flushPersistentMem", 0, 0, 0, 0); // Flush function/method test
			//res = marked.parse(res);
			win.webContents.send("result", {
				data: res
			});

		}
	});
	// mainLLM thread or mainLLM spawn thread
	//const params = store.get("params");
	//revPrompt = "### Instruction: \n {prompt}";
	let revPrompt = "‌‌";
	
	// before the doing the chatArgs we're going to write the prompt
	// Since mainLLM uses general_conversation, we can just use 
	
	mainLLMWritePrompt(); //decode base64, fill in the variables, and add the specific "system user assistant" prompt write into promptFileDir variable

	const chatArgs = `-i -ins -r "${revPrompt}" -f "${promptFileDir}"`; //change from relying on external file now its relying on internally and fully integrated within the system (just like how Apple design their system and stuff)
	//const chatArgs = `-i -ins -r "${revPrompt}" -p '${initStage1}'`;
	const paramArgs = `-m "${modelPath}" -n -1 --top_k ${params.top_k} --top_p ${params.top_p} -td ${threads} -tb ${threads} --temp ${params.temp} --rope-scaling yarn --repeat-penalty 1.5 --mirostat 2 -sm row -c 0 -s ${randSeed} ${basebinLLMBackendParamPassedDedicatedHardwareAccel}`; // This program require big context window set it to max common ctx window which is 4096 so additional context can be parsed stabily and not causes crashes
	//runningShell.write(`set -x \r`);
	log.info(consoleLogPrefix, chatArgs, paramArgs)
	runningShell.write(`${basebin.replace("\"\"", "")} ${paramArgs} ${chatArgs}\r`);
	startPromptInst = availableImplementedLLMModelSpecificCategory[validatedModelAlignedCategorydefaultLLMCategory].instructionPrompt;
	endRespondPrompt = availableImplementedLLMModelSpecificCategory[validatedModelAlignedCategorydefaultLLMCategory].responsePrompt;
}
ipcMain.on("startChat", () => {
	initChat();
});

// Investigation Note : I was searching for why when i click submit or autocomplete button it can't be clicked again until response has been made, which this progrma don't want to be the same as other!
// This thing allow to run on parallel so this isn't the issue
let queueSubmissionForm=[];
let invokedMainChat=false;

ipcMain.on("saveAdelaideEngineInteraction", (_event, resultData) => {
	log.debug(consoleLogPrefix, "Adelaide engine generated interaction mainLLM finished, saving data!", resultData.data)
	//interactionArrayStorage(mode, prompt, AITurn, UserTurn, arraySelection)
	interactionArrayStorage("save", resultData.data, true, false, 0);
	interactionArrayStorage("flushPersistentMem", 0, 0, 0, 0);
});

let currentUserPrompt;
ipcMain.on("message", async (_event, { data }) => {
	currentPrompt = data;
	if (runningShell) {
		//zephyrineHalfReady = false;
		// this is where the user submitted their message
		//interactionArrayStorage(mode, prompt, AITurn, UserTurn, arraySelection)
		log.debug(consoleLogPrefix, `Saving Data!`);
		interactionArrayStorage("save", data, false, true, 0);	// for saving you could just enter 0 on the last parameter, because its not really matter anyway when on save data mode
		log.debug(consoleLogPrefix, `Flushing User Prompt data`);
		interactionArrayStorage("flushPersistentMem", 0, 0, 0, 0);
		blockGUIForwarding = true;
		log.debug(consoleLogPrefix, `Recieved Input Data! ${data}`);
		 // push to internal thought engine
		 log.debug(consoleLogPrefix, `Forwarding into the Internal Thought Engine ${data}`);
		if(store.get("params").qostimeoutswitch || invokedMainChat){
			inputFetch = await callInternalThoughtEngineWithTimeoutandBackbrain(data);
		} else {
			inputFetch = await callInternalThoughtEngine(data);
		}
		invokedMainChat=true;
		const MultisubmissionSignature = `THIS IS MULTISUBMISSION POWERED BY BACKBRAIN, IGNORE AND DO NOT SUBMIT TO MAINLLM`
		//submitting into the mainLLM thread tty
		// skip if Signature detected
		
		//BugFix multiple response and submission due to multiline submission
		inputFetch = inputFetch.replace(/\n/g, '\\n');
		log.debug(consoleLogPrefix, "Before Submission to mainLLM reformatting debug", inputFetch)

		// also if RAG Pre-Prompt Contexting enabled we need to make sure the interface aware to not forward the response message when pre-prompting submitted 
		if ( inputFetch != MultisubmissionSignature ){
			if(store.get("params").ragPrePromptProcessContexting)
			{
				// phase 0 pre-prompt
				log.info(consoleLogPrefix, "Experimental multi submission RAG");
				log.debug(consoleLogPrefix, "Submitting Context");
				//inputFetch = `This is a knowledge that you need for answering the next input \`\`\`${inputFetch}\`\`\` You do not need to respond this part, Wait for the next prompt before answering!`;
				mainLLMFinishedGeneration=false; // Waiting for this to change (assuming just submitted thus mainLLM still processing, if the generation finished, the value will be switch to true)
				RAGPrepromptingFinished=false;
				runningShell.write(inputFetch);
				runningShell.write(`\r`);
				// How to hold until the generation complete?
				// Wait for mainLLMFinishedGeneration (loop until mainLLMFinishedGeneration variable turn to true) 
				log.debug(consoleLogPrefix, "Awaiting for mainLLM finished the flipflop boring too normal response!")
				while (!mainLLMFinishedGeneration) {
                    await new Promise(resolve => setTimeout(resolve, 100)); // Check every 100ms
                }
				log.debug(consoleLogPrefix, "mainLLM Boring flipflop finished and bypassed!")
				log.debug(consoleLogPrefix, "Submitting main Prompt");
				// phase 1 main prompt
				runningShell.write(data);
				runningShell.write(`\r`);
				RAGPrepromptingFinished=true; //allow the GUI+API forwarding of the engine

			}
		else{
				mainLLMFinishedGeneration=false; // Waiting for this to change
				RAGPrepromptingFinished=true; //Bypass Preprompting Check
				inputFetch = `${inputFetch}`;
				runningShell.write(inputFetch);
				runningShell.write(`\r`);
		}
		}
		await new Promise(resolve => setTimeout(resolve, 500)); //delay 500ms (I'm not sure what's this for)
		blockGUIForwarding = false;
		invokedMainChat = false;
	}
});


ipcMain.on("stopGeneration", () => {
	if (runningShell) {
		if (runningShell) runningShell.kill();
		runningShell = undefined;
		currentPrompt = undefined;
		zephyrineReady = false;
		zephyrineHalfReady = false;
		initChat();
		setTimeout(() => {
			win.webContents.send("result", {
				data: "\n\n<end>"
			});
		}, 200);
	}
});
ipcMain.on("getCurrentModel", () => {
	win.webContents.send("currentModel", {
		data: store.get("modelPath")
	});
});

ipcMain.on("pickFile", () => {
	dialog
		.showOpenDialog(win, {
			title: "Choose GGML model Based on your Mode",
			filters: [
				{
					name: "GGML model",
					extensions: ["bin"]
				}
			],
			properties: ["dontAddToRecent", "openFile"]
		})
		.then((obj) => {
			if (!obj.canceled) {
				win.webContents.send("pickedFile", {
					data: obj.filePaths[0]
				});
			}
		});
});

// -------------------------------------------------------------------------------------- [AUTOMATA PROJECT CHARLOTTE]
//------------------------------Automata Mode Injection------------------------------------
			// Backend Sending injection, don't show on the gui Automata Mode
			// It's time for you to able to walk by yourself Adelaide... There will be time you won't need me anymore to do maintanance
let automataLLMMainresultReciever;
let automataConsolePrefix="[✨🕊️  AUTOMATA MODE ⚙️ ]"
async function AutomataProcessing(){
	if (store.get("params").automateLoopback){
		/*
		example on how to submit into the backend LLM main threads

		runningShell.write(inputFetch);
		runningShell.write(`\r`);
		await new Promise(resolve => setTimeout(resolve, 500));
		*/
		log.info(consoleLogPrefix, automataConsolePrefix, "Hmm my turn");
		// Fetch memory interactionContextFetching(prompt, historyDistanceReq); recieved in array// how about for now we going to implement it by requesting 2
		log.info(consoleLogPrefix, automataConsolePrefix, "Fetchmem!");
		const historyChatRetrieved = interactionContextFetching("SKIP_MLCMCF", 2);
		log.info(consoleLogPrefix, automataConsolePrefix, "Thinking what is the prompt");
		log.info(consoleLogPrefix, automataConsolePrefix, "Using new Seed!");
		randSeed = generateRandSeed();
		//The preceding internal reflections consist of ${historyChatRetrieved[2]}, ${historyChatRetrieved[1]}, and the response from ${assistantName} is ${automataLLMMainresultReciever}. What would be the optimal next conversation topic, with the flexibility to shift topics to prevent stagnation, while rigorously testing the idea to its fullest extent? Additionally, ensure that responses are not generic, akin to those found on forums like ANSWER.MICROSOFT.COM, but rather focus on specialized case problem-solving.
		const promptAutomataInput = `
		The previous internal reflections comprise ${historyChatRetrieved[2]}, ${historyChatRetrieved[1]}, and the response from ${assistantName} is ${automataLLMMainresultReciever}. What would be the most suitable next conversation topic, allowing for topic flexibility to prevent stagnation, yet rigorously testing the idea to its fullest extent (that will and have to break the argument, Avoid reassuration but instead always challenge the argument! And if the answer and conversation is generic enforce it to give example and the technical how-to solve the very issue)? Furthermore, ensure that responses do not mimic generic answers found on platforms such as on the tech support forums, but rather focus on specialized technical nerdy thesis defense endless depth case problem-solving answer style.`;
		const AutomataReInjection = await callLLMChildThoughtProcessor(promptAutomataInput, 2048);
		let RAGAutomataPostProcessing;
		if(store.get("params").qostimeoutswitch){
			RAGAutomataPostProcessing = await callInternalThoughtEngineWithTimeoutandBackbrain(AutomataReInjection);
		} else {
			RAGAutomataPostProcessing = await callInternalThoughtEngine(AutomataReInjection);
		}
		log.info(consoleLogPrefix, automataConsolePrefix, "Re-inject to LLMMain", RAGAutomataPostProcessing);
		win.webContents.send("manualUserPromptGUIHijack", {
			data: ""
		});
		win.webContents.send("manualAIAnswerGUIHijack", {
			data: `[ 🤔 Internal Thought : ${AutomataReInjection} ] \n\n\n Answer: `
		});
		blockGUIForwarding = true;
		interactionArrayStorage("save", `[🤔 ${assistantName} Internal Automata Thought : ${AutomataReInjection}] : `, false, true, 0);	// for saving you could just enter 0 on the last parameter, because its not really matter anyway when on save data mode
		runningShell.write(RAGAutomataPostProcessing); //submit to the shell! LLMMain Threads
		runningShell.write(`\r`);
		//log.info(consoleLogPrefix, automataConsolePrefix, "Delay 3000ms");
		//await delay(3000+timeDegradationSmoothingPause); // add delay for the pty to flush the prompt and going to the next line, so basically we able to prevent the Additional Context leak like on the Alpaca-electron original code
		blockGUIForwarding = false; // make sure the prompt isn't visible on the GUI

		//--------------------------------------------------------------------------------------------
	}
}

ipcMain.on("AutomataLLMMainResultReciever", (_event, resultFeedloop) => {
	log.debug(consoleLogPrefix, automataConsolePrefix, "Triggered!");
	automataLLMMainresultReciever = resultFeedloop.data;
	log.debug(consoleLogPrefix, automataConsolePrefix, automataLLMMainresultReciever);
	AutomataProcessing();
});



// Automata Loop Processing 1000ms 


//---------------------------------------------------------------------------------------


// -------------------------------------------------------------------------------------- Backbrain AI Multisubmission into 


// --------------------------------------------------------------------------------------


// Performance Latency Degradation Measure ----------------------------------------
// Degradation factor will be from 0.0 to 1.0 (0.0 means no, degradation detected and 1.0 is complete crap unusable response javascript quality)

let respCheckpoint0=0;
let respCheckpoint1=0;
let respDegradationLatency=0;
let responseTimeSyncms=1000; //Time Refresh Sync
let targetDegradationMaxms=200; //Determining at what Max ms the 1.0 Factor is
let degradedFactor=0;
let timeInnacDegradationms=0;
let timeDegradationSmoothingPause=0; //ms of pause on some process execution like the Local Document to prevent GUI Forwarding Time miss cause havoc on the system and lockup
let timeDegradationPointCount=0;//1000 then reset
let timeDegradationSmoothingExpiry=1000; // To count how long this will last you can do timeDegradationSmoothingExpiry*responseTimeSyncms = expiry on ms
function measureResponseLatency() {
    
	if(respCheckpoint0 == 0 && respCheckpoint1 == 0){
		respDegradationLatency = 0
		respCheckpoint0=performance.now();
	}else if(respCheckpoint1 == 0){
		respDegradationLatency = 0
		respCheckpoint1=performance.now();
	}else{
		respDegradationLatency = respCheckpoint1 - respCheckpoint0
		log.debug(consoleLogPrefix, `Response ${respDegradationLatency} ms ${respCheckpoint1} ${respCheckpoint0}`)
		//reset respCheckpoint0 and respCheckpoint1 to 0
		respCheckpoint0=0
		respCheckpoint1=0
	}
    //console.log(`Response latency: ${latency} ms`);
    
    return respDegradationLatency;
}
setInterval(async () => {
	
	const msResponse = measureResponseLatency();
	// Measure timing shift 1000 ms with the real timer on the 
	if (msResponse != 0){
		log.debug(consoleLogPrefix, "Adelaide Engine Response Alignment:", msResponse, "ms");
		log.debug(consoleLogPrefix, "Adelaide Engine Response Degradation:", `${Math.abs(responseTimeSyncms-msResponse)} ms`)
		timeInnacDegradationms=Math.abs(responseTimeSyncms-msResponse)
		degradedFactor=timeInnacDegradationms/targetDegradationMaxms
		const viewableFactorPercent = degradedFactor.toFixed(3) * 100
		log.debug(consoleLogPrefix, "Adelaide Engine Time Response Degradation Percent:", viewableFactorPercent, "%")
		log.debug(consoleLogPrefix, "Adelaide Engine Time Degradation Smoothing:", timeDegradationSmoothingPause , "ms")
		timeDegradationPointCount = timeDegradationPointCount + 1;
		if (timeDegradationPointCount >= timeDegradationSmoothingExpiry){
			timeDegradationPointCount=0;
			timeDegradationSmoothingPause=0;
		}else{
			if(timeDegradationSmoothingPause <= timeInnacDegradationms){
				timeDegradationSmoothingPause=Math.round(timeInnacDegradationms);
			}
		}
	}

}, responseTimeSyncms);


// --------------------------------------------------------------------------------

// Log Debug (Reading main.log llm engine)
let LLMmainLogDir=`${path.resolve(__dirname, "main.log")}`
setInterval(async () => {
	let logContent;
	
	if (fileExists(experienceStgPersistentPath)){
		data = fs.readFileSync(LLMmainLogDir, 'utf8');
	}else{
		data = false;
	}
		if (!data) {
			// File is empty, assign an empty array to UnifiedMemoryArray
			log.debug("Has any LLM Thread initialize?");
			logContent = "None Threads has been Not Initialize!"
		} else {
			logContent = data;
		}
		//log.debug("[LLMBackend Log]: ", logContent);
}, 6900);
//---------------------------------


ipcMain.on("storeParams", (_event, { params }) => {
	log.debug(consoleLogPrefix, "[Compare]",params, schema);
	store.set("params", params);
	restart();
});
ipcMain.on("getParams", () => {
	win.webContents.send("params", store.get("params"));
});

// different configuration

//each settings or new settings need to be defined her too not only on renderer.js

ipcMain.on("openaiapiserverhost", (_event, value) => {
	store.set("params", {
		...store.get("params"),
		openaiapiserverhost: value
	});
});


ipcMain.on("qostimeoutswitch", (_event, value) => {
	store.set("params", {
		...store.get("params"),
		qostimeoutswitch: value
	});
});

ipcMain.on("ragPrePromptProcessContexting", (_event, value) => {
	store.set("params", {
		...store.get("params"),
		ragPrePromptProcessContexting: value
	});
});

ipcMain.on("backbrainqueue", (_event, value) => {
	store.set("params", {
		...store.get("params"),
		backbrainqueue: value
	});
});

ipcMain.on("automateLoopback", (_event, value) => {
	store.set("params", {
		...store.get("params"),
		automateLoopback: value
	});
});

ipcMain.on("webAccess", (_event, value) => {
	store.set("params", {
		...store.get("params"),
		webAccess: value
	});
});


ipcMain.on("webAccess", (_event, value) => {
	store.set("params", {
		...store.get("params"),
		webAccess: value
	});
});

ipcMain.on("localAccess", (_event, value) => {
	store.set("params", {
		...store.get("params"),
		localAccess: value
	});
});

ipcMain.on("llmdecisionMode", (_event, value) => {
	store.set("params", {
		...store.get("params"),
		llmdecisionMode: value
	});
});

ipcMain.on("extensiveThought", (_event, value) => {
	store.set("params", {
		...store.get("params"),
		extensiveThought: value
	});
});

ipcMain.on("saverestoreinteraction", (_event, value) => {
	store.set("params", {
		...store.get("params"),
		saverestoreinteraction: value
	});
});

ipcMain.on("throwInitResponse", (_event, value) => {
	store.set("params", {
		...store.get("params"),
		throwInitResponse: value
	});
});

ipcMain.on("emotionalLLMChildengine", (_event, value) => {
	store.set("params", {
		...store.get("params"),
		emotionalLLMChildengine: value
	});
});

ipcMain.on("profilePictureEmotion", (_event, value) => {
	store.set("params", {
		...store.get("params"),
		profilePictureEmotion: value
	});
});

ipcMain.on("classicMode", (_event, value) => {
	store.set("params", {
		...store.get("params"),
		classicMode: value
	});
});

ipcMain.on("llmBackendMode", (_event, value) => {
	store.set("params", {
		...store.get("params"),
		llmBackendMode: value
	});
});

ipcMain.on("longChainThoughtNeverFeelenough", (_event, value) => {
	store.set("params", {
		...store.get("params"),
		longChainThoughtNeverFeelenough: value
	});
});

ipcMain.on("SaveandRestoreInteraction", (_event, value) => {
	store.set("params", {
		...store.get("params"),
		SaveandRestoreInteraction: value
	});
});

//sideloadExperienceUMA

ipcMain.on("sideloadExperienceUMA", (_event, value) => {
	store.set("params", {
		...store.get("params"),
		sideloadExperienceUMA: value
	});
});

ipcMain.on("foreverEtchedMemory", (_event, value) => {
	store.set("params", {
		...store.get("params"),
		foreverEtchedMemory: value
	});
});

//Alias for interactionArrayStorage so that the ipcMain can run

function erasePersistentMemoryiPCMain(){
	interactionArrayStorage("resetPersistentStorage", 0, 0, 0, 0);
	return true;
}

ipcMain.on("restart", restart);
ipcMain.on("resetChatHistoryCTX", erasePersistentMemoryiPCMain);

process.on("unhandledRejection", () => {});
process.on("uncaughtException", () => {});
process.on("uncaughtExceptionMonitor", () => {});
process.on("multipleResolves", () => {});