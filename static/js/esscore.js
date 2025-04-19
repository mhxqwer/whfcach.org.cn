//General
//for example: instead of each module writing out script found in moduleMaxMin_OnClick have the functionality cached
//

var ESS_COL_DELIMITER = String.fromCharCode(16);
var ESS_ROW_DELIMITER = String.fromCharCode(15);
var __ess_m_bPageLoaded = false;

window.onload = __ess_Page_OnLoad;

function __ess_ClientAPIEnabled()
{
	return typeof(ess) != 'undefined';
}


function __ess_Page_OnLoad()
{
	if (__ess_ClientAPIEnabled())
	{
			//init tabpanes
		__ess_InitTabPanes(ess.getVar("esstabpanegroups"));
		var sLoadHandlers = ess.getVar('__ess_pageload');
		if (sLoadHandlers != null)
			eval(sLoadHandlers);
		
		ess.dom.attachEvent(window, 'onscroll', __ess_bodyscroll);
		
	}
	__ess_m_bPageLoaded = true;
}

function __ess_KeyDown(iKeyCode, sFunc, e)
{
	if (e == null)
		e = window.event;

	if (e.keyCode == iKeyCode)
	{
		eval(unescape(sFunc));
		return false;
	}
}

function __ess_bodyscroll() 
{
	var oF=document.forms[0];	
	if (__ess_ClientAPIEnabled() && __ess_m_bPageLoaded)
		oF.ScrollTop.value=document.documentElement.scrollTop ? document.documentElement.scrollTop : ess.dom.getByTagName("body")[0].scrollTop;
}

function __ess_setScrollTop(iTop)
{
	if (__ess_ClientAPIEnabled())
	{
		if (iTop == null)
			iTop = document.forms[0].ScrollTop.value;
	
		var sID = ess.getVar('ScrollToControl');
		if (sID != null && sID.length > 0)
		{
			var oCtl = ess.dom.getById(sID);
			if (oCtl != null)
			{
				iTop = ess.dom.positioning.elementTop(oCtl);
				ess.setVar('ScrollToControl', '');
			}
		}
		window.scrollTo(0, iTop);
	}
}

//Focus logic
function __ess_SetInitialFocus(sID)
{
	var oCtl = ess.dom.getById(sID);	
	if (oCtl != null && __ess_CanReceiveFocus(oCtl))
		oCtl.focus();
}	

function __ess_CanReceiveFocus(e)
{
	//probably should call getComputedStyle for classes that cause item to be hidden
	if (e.style.display != 'none' && e.tabIndex > -1 && e.disabled == false && e.style.visible != 'hidden')
	{
		var eParent = e.parentElement;
		while (eParent != null && eParent.tagName != 'BODY')
		{
			if (eParent.style.display == 'none' || eParent.disabled || eParent.style.visible == 'hidden')
				return false;
			eParent = eParent.parentElement;
		}
		return true;
	}
	else
		return false;
}
//tabpanes handler
function __ess_InitTabPanes(paneGroups)
{
  //var paneGroups = ess.getVar("esstabpanegroups");
  if(paneGroups!=null){
     paneGroups =paneGroups.split(';')
  }else{
    return 0;
  }
  var tabPane;
  var tabPaneItems;
  var titleSection;
  var contentSection;
  var tcGroup;//title content group split by |
  var tabContainer;
  var tabPanesContainer;
  var tabContentContainer;
  for(var i =0; i<paneGroups.length-1;i++)
  {
     tabPane = new __ess_TabPane(paneGroups[i]);
     tabPaneItems = ess.getVar(tabPane.groupName);
     if(tabPaneItems!=null){
       tabPaneItems = tabPaneItems.split(';');
     }else{
       continue;
     }
     for(var j=0;j<tabPaneItems.length-1;j++)
     {
       tcGroup =tabPaneItems[j].split('|');
       if(j==0)
       {
         //在所有的tabpane前插入一个span
         tabContainer = document.createElement("div");
         tabContainer.className = "tabContainer";
         tabPanesContainer = document.createElement("div");
         tabPanesContainer.className = "tabPanesContainer";
         tabContentContainer = document.createElement("div");
         tabContentContainer.className = "tabContentContainer";
         //panes group
         tabContainer.insertAdjacentElement("BeforeEnd",tabPanesContainer);
         //contents group
         tabContainer.insertAdjacentElement("BeforeEnd",tabContentContainer);
         
         ess.dom.getById(tcGroup[0]).insertAdjacentElement("BeforeBegin",tabContainer);
       }
       tabPane.addItem(new __ess_TabPaneItem(tcGroup[0],tcGroup[1],tabPane));
    
       tabPanesContainer.insertAdjacentElement("BeforeEnd",tabPane.items[j].paneSection);
       tabContentContainer.insertAdjacentElement("BeforeEnd",tabPane.items[j].contentSection);

     }
     var  selectIndex= ess.getVar(tabPane.groupName + "_selected");
     if(selectIndex!=null){
        tabPane.select(tabPane.items[parseInt(selectIndex)]);
     }else{
       if(tabPane.items[0]){
          tabPane.select(tabPane.items[0]);
       }
     }
  }
}
function __ess_TabPane(groupName)
{
  this.groupName = groupName;
  this.items =[];
  this.selectedItem = null;
}
__ess_TabPane.prototype ={
  addItem:function(tabPaneItem){
    tabPaneItem.index = this.items.length;
    this.items.push(tabPaneItem);
  },
  select:function(tabPaneItem){
    if(this.selectedItem)
       this.selectedItem.hide();
    this.selectedItem = tabPaneItem;
    this.selectedItem.show();
    ess.setVar(this.groupName + "_selected",this.selectedItem.index);
    if(this.onSelect)
      this.onSelect(tabPaneItem);
  }
}
function __ess_TabPaneItem(titleSection,contentSection,parent)
{
  this.titleSection = ess.dom.getById(titleSection);
  this.contentSection = ess.dom.getById(contentSection);
  this.contentSection.className ="tabPaneContent";
  this.parent = parent;
  this.index =0;
  this.paneSection = null;
  this._render();
  this.hide();
  
}
__ess_TabPaneItem.prototype ={
  _render:function(){//private method
    this.paneSection = document.createElement("span");
    this.paneSection.className = "tabPaneContainerNormal" ; 
    this.paneSection.left = document.createElement("span");
    this.paneSection.left.className ="tabPaneLeft";
    //this.tabPane.left.innerHTML ="[";
    this.paneSection.insertAdjacentElement("BeforeEnd",this.paneSection.left);
    this.titleSection.className ="tabPaneTitle"
    this.paneSection.insertAdjacentElement("BeforeEnd",this.titleSection);
    this.paneSection.right = document.createElement("span");
    this.paneSection.right.className ="tabPaneRight";
    //this.tabPane.right.innerHTML ="]";
    this.paneSection.insertAdjacentElement("BeforeEnd",this.paneSection.right);
    ess.dom.addSafeHandler(this.paneSection, 'onclick', this, 'onClick');
    
    return this.paneSection;
  },
  hide:function(){
    this.contentSection.style.display='none';
    this.paneSection.className = "tabPaneContainerNormal" ;
  },
  show:function(){
    this.contentSection.style.display ='';
    this.paneSection.className = "tabPaneContainerActive" ;
  },
  onClick:function(e){
    if(this.titleSection.jsfunction){
        eval(this.titleSection.jsfunction);
    }
    this.parent.select(this);
  }
}
//Max/Min Script
function __ess_ContainerMaxMin_OnClick(oLnk, sContentID)
{
	var oContent = ess.dom.getById(sContentID);
	if (oContent != null)
	{
		var oBtn = oLnk.childNodes[0];
		var sContainerID = oLnk.getAttribute('containerid');
		var sCookieID = oLnk.getAttribute('cookieid');
		var sCurrentFile = oBtn.src.toLowerCase().substr(oBtn.src.lastIndexOf('/'));
		var sMaxFile;
		var sMaxIcon;
		var sMinIcon;

		if (ess.getVar('min_icon_' + sContainerID))
			sMinIcon = ess.getVar('min_icon_' + sContainerID);
		else
			sMinIcon = ess.getVar('min_icon');

		if (ess.getVar('max_icon_' + sContainerID))
			sMaxIcon = ess.getVar('max_icon_' + sContainerID);
		else
			sMaxIcon = ess.getVar('max_icon');

		sMaxFile = sMaxIcon.toLowerCase().substr(sMaxIcon.lastIndexOf('/'));

		var iNum = 5;
		if (oLnk.getAttribute('animf') != null)
			iNum = new Number(oLnk.getAttribute('animf'));
			
		if (sCurrentFile == sMaxFile)
		{
			oBtn.src = sMinIcon;				
			//oContent.style.display = '';
			ess.dom.expandElement(oContent, iNum);
			oBtn.title = ess.getVar('min_text');
			if (sCookieID != null)
			{
				if (ess.getVar('__ess_' + sContainerID + ':defminimized') == 'true')
					ess.dom.setCookie(sCookieID, 'true', 365);
				else
					ess.dom.deleteCookie(sCookieID);
			}
			else
				ess.setVar('__ess_' + sContainerID + '_Visible', 'true');
		}
		else
		{
			oBtn.src = sMaxIcon;				
			//oContent.style.display = 'none';
			ess.dom.collapseElement(oContent, iNum);
			oBtn.title = ess.getVar('max_text');
			if (sCookieID != null)
			{
				if (ess.getVar('__ess_' + sContainerID + ':defminimized') == 'true')
					ess.dom.deleteCookie(sCookieID);
				else
					ess.dom.setCookie(sCookieID, 'false', 365);				
			}
			else
				ess.setVar('__ess_' + sContainerID + '_Visible', 'false');			
		}
		
		return true;	//cancel postback
	}
	return false;	//failed so do postback
}

function __ess_Help_OnClick(sHelpID)
{
	var oHelp = ess.dom.getById(sHelpID);
	if (oHelp != null)
	{
		if (oHelp.style.display == 'none')
			oHelp.style.display = '';
		else
			oHelp.style.display = 'none';

		return true;	//cancel postback
	}
	return false;	//failed so do postback
}

function __ess_SectionMaxMin(oBtn, sContentID)
{
	var oContent = ess.dom.getById(sContentID);
	if (oContent != null)
	{
		var sMaxIcon = oBtn.getAttribute('max_icon');
		var sMinIcon = oBtn.getAttribute('min_icon');
		if (oContent.style.display == 'none')
		{
			oBtn.src = sMinIcon;				
			oContent.style.display = '';
			ess.setVar(oBtn.id + ':exp', 1);
		}
		else
		{
			oBtn.src = sMaxIcon;				
			oContent.style.display = 'none';
			ess.setVar(oBtn.id + ':exp', 0);
		}
		return true;	//cancel postback
	}
	return false;	//failed so do postback
}

//Drag N Drop
function __ess_enableDragDrop()
{
	var aryConts = ess.getVar('__ess_dragDrop').split(";");	
	var aryTitles;

	for (var i=0; i < aryConts.length; i++)
	{
		aryTitles = aryConts[i].split(" ");
		if (aryTitles[0].length > 0)
		{			
			var oCtr = ess.dom.getById(aryTitles[0]);
			var oTitle = ess.dom.getById(aryTitles[1]);
			if (oCtr != null && oTitle != null)
			{
				oCtr.setAttribute('moduleid', aryTitles[2]);
				ess.dom.positioning.enableDragAndDrop(oCtr, oTitle, '__ess_dragComplete()', '__ess_dragOver()');
			}	
		}
	}
}

var __ess_oPrevSelPane;
var __ess_oPrevSelModule;
var __ess_dragEventCount=0;
function __ess_dragOver()
{
	__ess_dragEventCount++;
	if (__ess_dragEventCount % 75 != 0)	//only calculate position every 75 events
		return;
	
	var oCont = ess.dom.getById(ess.dom.positioning.dragCtr.contID);

	var oPane = __ess_getMostSelectedPane(ess.dom.positioning.dragCtr);
		
	if (__ess_oPrevSelPane != null)	//reset previous pane's border
		__ess_oPrevSelPane.pane.style.border = __ess_oPrevSelPane.origBorder;

	if (oPane != null)
	{		
		__ess_oPrevSelPane = oPane;
		oPane.pane.style.border = '4px double ' + ESS_HIGHLIGHT_COLOR;
		var iIndex = __ess_getPaneControlIndex(oCont, oPane);

		var oPrevCtl;
		var oNextCtl;
		for (var i=0; i<oPane.controls.length; i++)
		{
			if (iIndex > i && oPane.controls[i].id != oCont.id)
				oPrevCtl = oPane.controls[i];
			if (iIndex <= i && oPane.controls[i].id != oCont.id)
			{
				oNextCtl = oPane.controls[i];
				break;
			}
		}			
		
		if (__ess_oPrevSelModule != null)
			ess.dom.getNonTextNode(__ess_oPrevSelModule.control).style.border = __ess_oPrevSelModule.origBorder;
			

		if (oNextCtl != null)
		{
			__ess_oPrevSelModule = oNextCtl;
			ess.dom.getNonTextNode(oNextCtl.control).style.borderTop = '5px groove ' + ESS_HIGHLIGHT_COLOR;
		}
		else if (oPrevCtl != null)
		{
			__ess_oPrevSelModule = oPrevCtl;
			ess.dom.getNonTextNode(oPrevCtl.control).style.borderBottom = '5px groove ' + ESS_HIGHLIGHT_COLOR;
		}
	}
}

function __ess_dragComplete()
{
	var oCtl = ess.dom.getById(ess.dom.positioning.dragCtr.contID);
	var sModuleID = oCtl.getAttribute('moduleid');
	
	if (__ess_oPrevSelPane != null)
		__ess_oPrevSelPane.pane.style.border = __ess_oPrevSelPane.origBorder;

	if (__ess_oPrevSelModule != null)
		ess.dom.getNonTextNode(__ess_oPrevSelModule.control).style.border = __ess_oPrevSelModule.origBorder;
		
	var oPane = __ess_getMostSelectedPane(ess.dom.positioning.dragCtr);
	var iIndex;
	if (oPane == null)
	{
		var oPanes = __ess_Panes();
		for (var i=0; i<oPanes.length; i++)
		{
			if (oPanes[i].id == oCtl.parentNode.id)
				oPane = oPanes[i];
		}
	}	
	if (oPane != null)
	{
		iIndex = __ess_getPaneControlIndex(oCtl, oPane);
		__ess_MoveToPane(oPane, oCtl, iIndex);

		ess.callPostBack('MoveToPane', 'moduleid=' + sModuleID, 'pane=' + oPane.paneName, 'order=' + iIndex * 2); 
	}
}

function __ess_MoveToPane(oPane, oCtl, iIndex)
{

	if (oPane != null)
	{
		var aryCtls = new Array();
		for (var i=iIndex; i<oPane.controls.length; i++)
		{
			if (oPane.controls[i].control.id != oCtl.id)
				aryCtls[aryCtls.length] = oPane.controls[i].control;

			ess.dom.removeChild(oPane.controls[i].control);
		}
		ess.dom.appendChild(oPane.pane, oCtl);
		oCtl.style.top=0;
		oCtl.style.left=0;
		oCtl.style.position = 'relative';
		for (var i=0; i<aryCtls.length; i++)
		{
			ess.dom.appendChild(oPane.pane, aryCtls[i]);
		}
		__ess_RefreshPanes();
	}
	else
	{
		oCtl.style.top=0;
		oCtl.style.left=0;
		oCtl.style.position = 'relative';
	}
}

function __ess_RefreshPanes()
{
	var aryPanes = ess.getVar('__ess_Panes').split(';');
	var aryPaneNames = ess.getVar('__ess_PaneNames').split(';');
	__ess_m_aryPanes = new Array();
	for (var i=0; i<aryPanes.length; i++)
	{
		if (aryPanes[i].length > 0)
			__ess_m_aryPanes[__ess_m_aryPanes.length] = new __ess_Pane(ess.dom.getById(aryPanes[i]), aryPaneNames[i]);
	}
}

var __ess_m_aryPanes;
var __ess_m_aryModules;
function __ess_Panes()
{
	if (__ess_m_aryPanes == null)
	{
		__ess_m_aryPanes = new Array();
		__ess_RefreshPanes();
	}
	return __ess_m_aryPanes;
}

function __ess_Modules(sModuleID)
{
	if (__ess_m_aryModules == null)
		__ess_RefreshPanes();
	
	return __ess_m_aryModules[sModuleID];
}

function __ess_getMostSelectedPane(oContent)
{
	var oCDims = new ess.dom.positioning.dims(oContent);
	var iTopScore=0;
	var iScore;
	var oTopPane;
	for (var i=0; i<__ess_Panes().length; i++)
	{
		var oPane = __ess_Panes()[i];
		var oPDims = new ess.dom.positioning.dims(oPane.pane);
		iScore = ess.dom.positioning.elementOverlapScore(oPDims, oCDims);
		
		if (iScore > iTopScore)
		{
			iTopScore = iScore;
			oTopPane = oPane;
		}
	}
	return oTopPane;
}

function __ess_getPaneControlIndex(oContent, oPane)
{
	if (oPane == null)
		return;
	var oCDims = new ess.dom.positioning.dims(oContent);
	var oCtl;
	if (oPane.controls.length == 0)
		return 0;
	for (var i=0; i<oPane.controls.length; i++)
	{
		oCtl = oPane.controls[i];
		var oIDims = new ess.dom.positioning.dims(oCtl.control);
		if (oCDims.t < oIDims.t)
			return oCtl.index;
	}
	if (oCtl != null)
		return oCtl.index+1;
	else
		return 0;
}

//Objects
function __ess_Pane(ctl, sPaneName)
{
	this.pane = ctl;
	this.id = ctl.id;
	this.controls = new Array();
	this.origBorder = ctl.style.border;
	this.paneName = sPaneName;
	
	var iIndex = 0;
	var strModuleOrder='';
	for (var i=0; i<ctl.childNodes.length; i++)
	{
		var oNode = ctl.childNodes[i];
		if (ess.dom.isNonTextNode(oNode))	
		{
			if (__ess_m_aryModules == null)
				__ess_m_aryModules = new Array();

			//if (oNode.tagName == 'A' && oNode.childNodes.length > 0)
			//	oNode = oNode.childNodes[0];	//ESS now embeds anchor tag 
				
			var sModuleID = oNode.getAttribute('moduleid');
			if (sModuleID != null && sModuleID.length > 0)
			{
				strModuleOrder += sModuleID + '~';
				this.controls[this.controls.length] = new __ess_PaneControl(oNode, iIndex);
				__ess_m_aryModules[sModuleID] = oNode.id;
				iIndex+=1;
			}
		}
	}
	this.moduleOrder = strModuleOrder;

}

function __ess_PaneControl(ctl, iIndex)
{
	this.control = ctl;
	this.id = ctl.id;
	this.index = iIndex;
	this.origBorder = ctl.style.border;
	
}

var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?b80651fead8e12f571f45143eae165e6";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();

