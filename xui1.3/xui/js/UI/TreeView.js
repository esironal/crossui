Class("xui.UI.TreeView","xui.UI.TreeBar",{
    Instance:{
        _afterInsertItems:function(profile, data, pid){
            profile.box._reorderItems(profile, pid);
        },
        _afterRemoveItems:function(profile, data){
            _.arr.each(data,function(item){
                profile.box._reorderItems(profile, item._pid);
            });
        }
    },
    Initialize:function(){
        this.addTemplateKeys(['IMAGE']);
         var t = this.getTemplate();
         t.$submap.items.ITEM.BAR.className='xui-uitembg {cls_group} {cls_fold} {disabled} {readonly}';
         this.setTemplate(t);
    },
    Static:{
        Appearances:{
            ITEMS:{
                //overflow: 'visible'
                'padding':'1px'
            },
            ITEM:{
                'white-space': 'nowrap',
                position:'relative',
                overflow:'hidden'
            },
            BAR:{
               zoom:xui.browser.ie?1:null,
               position:'relative',
               display:'block',
               'font-size':'12px',
               'outline-offset':'-1px',
               '-moz-outline-offset':(xui.browser.gek && xui.browser.ver<3)?'-1px !important':null
            },
            'BAR-mouseover, BAR-mousedown, BAR-checked':{
               'background-image':xui.UI.$bg('item.gif','','List'),
               'background-repeat':'repeat-x'
            },
            'BAR-mouseover':{
                $order:1,
                'background-position': 'left -51px'
            },
            'BAR-mousedown':{
                $order:2,
                'background-position': 'left -101px'
            },
            'BAR-checked':{
                $order:2,
                'background-position': 'left top'
            },
            SUB:{
                zoom:xui.browser.ie?1:null,
                height:0,
                'font-size':'1px',
                //1px for ie8
                'line-height':'1px',
                position:'relative',
                overflow:'hidden'
            },
            BOX:{
                left:0,
                overflow: 'auto',
                position:'relative'
            },
            'BAR ITEMICON':{
                'background-image': xui.UI.$bg('icons.gif', '', true),
                'background-repeat':'no-repeat',
                'background-position' : '-244px -236px'
            },
            'BAR-fold ITEMICON':{
                $order:1,
                'background-position' : '-260px -236px'
            },
            'BAR-expand ITEMICON':{
                $order:1,
                'background-position' : '-276px -236px'
            },
            'IMAGE-vertical, IMAGE-path-1, IMAGE-path-2, IMAGE-path-3, IMAGE-fold-1, IMAGE-fold-2, IMAGE-fold-3':{
                $order:1,
                'background-image': xui.UI.$bg('icons.gif', '', true),
                'background-repeat':'no-repeat',
                'background-position':'0 0',
                width:'16px',
                height:'18px',
                'vertical-align':'middle'
            },
            'IMAGE-none':{
                width:'16px',
                height:'18px',
                'vertical-align':'middle'
            },
            'IMAGE-path-1,IMAGE-path-2':{
                $order:2,
                'background-position' : '-196px -236px'
            },
            'IMAGE-path-3':{
                $order:3,
                'background-position' : '-212px -236px'
            },
            'IMAGE-fold-1':{
                $order:4,
                'background-position' : '-196px -254px'
            },
            'IMAGE-fold-2':{
                $order:5,
                'background-position' : '-212px -254px'
            },
            'IMAGE-fold-3':{
                $order:6,
                'background-position' : '-228px -254px'
            },
            'IMAGE-fold-1-checked':{
                $order:7,
                'background-position' : '-244px -254px'
            },
            'IMAGE-fold-2-checked':{
                $order:8,
                'background-position' : '-260px -254px'
            },
            'IMAGE-fold-3-checked':{
                $order:9,
                'background-position' : '-276px -254px'
            },
            'IMAGE-fold-1-mousedown':{
                $order:10,
                'background-position' : '-196px -272px'
            },
            'IMAGE-fold-2-mousedown':{
                $order:11,
                'background-position' : '-212px -272px'
            },
            'IMAGE-fold-3-mousedown':{
                $order:12,
                'background-position' : '-228px -272px'
            },
            'IMAGE-fold-1-checked-mousedown':{
                $order:13,
                'background-position' : '-244px -272px'
            },
            'IMAGE-fold-2-checked-mousedown':{
                $order:14,
                'background-position' : '-260px -272px'
            },
            'IMAGE-fold-3-checked-mousedown':{
                $order:15,
                'background-position' : '-276px -272px'
            },
            'IMAGE-vertical':{
                $order:16,
                'background-position' : '-228px -236px'
            }
        },
        Behaviors:{
            MARK:{
                onClick:function(profile, e, src){
                   profile.box._onclickbar(profile,e,xui.use(src).parent().xid());
                   return false;
                }
            },
            ITEMICON:{
                onClick:function(profile, e, src){
                   profile.box._onclickbar(profile,e,xui.use(src).parent().xid());
                   return false;
                }
            }
        },
        DataModel:{
            group:null,
            noIcons:{
                ini:false,
                action:function(v){
                    this.getSubNode("ITEMICON",true).css('display',v?'none':'');
                }
            }
        },
        _buildIcon:function(cls, type){
            return "<span class='"+cls+type+"'></span>";
        },
        _getType:function(sub, type, cls, checked){
            var r=sub
                ? type=='last' ? '-fold-3': type=='first'? '-fold-1' : '-fold-2'
                : type=='last' ? '-path-3': type=='first'? '-path-1' : '-path-2';
            return checked?(cls+r+" "+cls+r+"-checked xui-treebar-toggle-checked"):(cls+r);
        },
        _prepareItem:function(profile, item, oitem, pid, index,len){
            var p=profile.properties,
                map1=profile.ItemIdMapSubSerialId,
                map2=profile.SubSerialIdMapItem,
                pitem,arr,ll,
                html,
                cls=profile.getClass('IMAGE'),
                buildIcon=this._buildIcon,
                getType=this._getType;

            if(pid){
                oitem._pid=pid;
                if(pitem=map2[map1[pid]]){
                    oitem._deep=pitem._deep+1;
                    arr=_.copy(pitem._icons);
                    arr.push(index==len-1?'last':index===0?'first':'middle');
                    oitem._icons=arr;
                    item.rulerStyle='width:'+(oitem._deep*16)+'px;';


                    // build image html
                    html='';
                    ll=arr.length-1;
                    _.arr.each(arr,function(o,i){
                        if(i!==ll)
                            html+=buildIcon(cls, o=='last'?(p.togglePlaceholder?'-empty':'-none'):'-vertical');
                    });
                    item.innerIcons=html;

                    // for the last one
                    item.togglemark = item.sub?(getType(item.sub, arr[ll],cls,item._checked)):(p.togglePlaceholder?'xui-uicmd-empty':'xui-uicmd-none');
                }
            }else{
                oitem._deep=0;
                oitem._icons=[index==len-1?'last':index===0?'first':'middle'];
                item.rulerStyle='';
                item.innerIcons='';

                item.togglemark = item.sub?(getType(item.sub, oitem._icons[0], cls, item._checked)):(p.togglePlaceholder?'xui-uicmd-empty':'xui-uicmd-none');
            }
            // show image
            item.imageDisplay=p.noIcons?"display:none;":"";
            //
            item.cls_fold = item.sub?profile.getClass('BAR','-fold'):'';

            item._noicon=p.onIcons?"":"";

            item.disabled = item.disabled?'xui-ui-disabled':'';
            item._itemDisplay=item.hidden?'display:none;':'';
            item.mark2Display = p.selMode=='multibycheckbox'?'':'display:none;';
            item._tabindex = p.tabindex;
            xui.UI.List._prepareCmds(profile, item);
        },
        _reorderItems:function(profile, pid){
            var p=profile.properties,
                map1=profile.ItemIdMapSubSerialId,
                map2=profile.SubSerialIdMapItem,
                cls=profile.getClass('IMAGE'),
                getType=this._getType;

            var getAllSub=function(item, arr){
                if(item.sub && item.sub.length){
                    var me=arguments.callee;
                    _.arr.each(item.sub,function(item){
                        if(item._icons)
                            arr.push(item);
                        me(item, arr);
                    });
                }
            };
            // no parent now
            if(pid && !map1[pid])
                return;

            var baseid=profile.box.KEY+"-RULER:"+profile.serialId+":",
                arr=pid?map2[map1[pid]].sub:p.items,
                len=arr.length,ov,nv,deep=0,
                aitem,ns;
            _.arr.each(arr,function(item,i){
                if(item._icons){
                    ov=item._icons[item._icons.length-1];
                    nv=i==len-1?'last':i===0?'first':'middle';
                    if(ov!=nv){
                        ns=[];
                        aitem=null;

                        item._icons[deep=item._icons.length-1]=nv;
                        // ui
                        aitem=item;
                        // recursive
                        var a=[];
                        getAllSub(item, a);
                        _.arr.each(a,function(o){
                            o._icons[deep]=nv;
                            // ui
                            ns.push(o.id);
                        });
                        // the toggle image
                        if(aitem){
                            profile.getSubNodeByItemId('TOGGLE', aitem.id)
                                // "xui-treeview-image-fold-2 xui-treeview-image--fold-2-checked"
                                // "xui-treeview-image-path-2"
                                .replaceClass(new RegExp("\\b"+cls+"-[\\w]+-[\\w]+((-[\\w]+)*)\\b", "g"), getType(aitem.sub, nv, cls) + '$1');
                        }
                        // parent's images
                        if(ns.length){
                            _.arr.each(ns,function(id,i){
                                ns[i]=baseid+map1[id];
                            });

                            // refresh className. -none or -vertical only
                            ns=xui(ns).first();
                            if(deep)
                                ns=ns.next(deep);
                            ns.removeClass(new RegExp("\\b"+cls+"[-\\w]+\\b"))
                              .addClass(cls+(nv=='last'?(p.togglePlaceholder?'-empty':'-none'):'-vertical'));
                        }
                    }
                }
            });

        },
        _tofold:function(profile,item,pid){
            var cls=profile.getClass('IMAGE');
            profile.getSubNodeByItemId('BAR', pid).addClass(profile.getClass('BAR','-fold'));
            profile.getSubNodeByItemId('TOGGLE', pid).replaceClass(new RegExp("\\b"+cls+"-path([-\\w]+)\\b"), cls + '-fold$1');
        }
    }
});
