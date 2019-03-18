export const createMap = function (esriLoader, options, self, yunnanJson, store) {
  esriLoader.loadModules(
    [
      'esri/Map',
      "esri/Basemap",
      "esri/Viewpoint",
      "esri/Graphic",
      'esri/views/MapView',
      "esri/layers/Layer",
      "esri/layers/FeatureLayer",
      "esri/layers/WebTileLayer",
      "esri/layers/TileLayer",
      "esri/layers/GraphicsLayer",
      "esri/widgets/Expand",
      "esri/widgets/Home",
      "esri/widgets/LayerList",
      "esri/widgets/BasemapGallery",
      "esri/widgets/Legend",
      "esri/widgets/Compass",
      "esri/widgets/Print",
      "esri/core/urlUtils",
      "esri/config",
      "esri/portal/Portal"
    ], options)
    .then(
      ([
        Map,
        Basemap,
        Viewpoint,
        Graphic,
        MapView,
        Layer,
        FeatureLayer,
        WebTileLayer,
        TileLayer,
        GraphicsLayer,
        Expand,
        Home,
        LayerList,
        BasemapGallery,
        Legend,
        Compass,
        Print,
        urlUtils,
        esriConfig,
        Portal
      ]) => {

        // urlUtils.addProxyRule({
        //     urlPrefix: "http://202.114.148.160//arcgis_js_api4.8",
        //     proxyUrl: "http://202.114.148.160/DotNet/proxy.ashx"
        // });

        function ConstructBasemap() {
          //地图底图
          const ESRIvectorBaselayer = new TileLayer({
            url: "https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer"
          })

          const ESRIVectorBasemap = new Basemap({
            baseLayers: [ESRIvectorBaselayer],
            title: "ESRI矢量图",
            thumbnailUrl: "https://www.arcgis.com/sharing/rest/content/items/fb84ad313bd3432983488ed1ba1d5bf3/info/thumbnail/ago_downloaded.png?f=json"
          });

          const ESRIrasterBaselayer = new TileLayer({
            url: "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer",
          })

          const ESRIRasterBasemap = new Basemap({
            baseLayers: [ESRIrasterBaselayer],
            title: "ESRI影像图",
            thumbnailUrl: "https://www.arcgis.com/sharing/rest/content/items/25cefd52161e44b8a5eec87768f79079/info/thumbnail/thumbnail.jpeg?f=json"
          });

          const rasterTileLayer = new WebTileLayer({
            urlTemplate: "http://{subDomain}.tianditu.com/DataServer?T=img_w&x={col}&y={row}&l={level}",
            subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
            copyright: "天地图影像"
          });

          const vectorTileLayer = new WebTileLayer({
            urlTemplate: "http://{subDomain}.tianditu.com/DataServer?T=vec_w&x={col}&y={row}&l={level}",
            subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
            copyright: "天地图矢量"
          });

          const imgAnnotationTileLayer = new WebTileLayer({
            urlTemplate: "http://{subDomain}.tianditu.com/DataServer?T=cia_w&x={col}&y={row}&l={level}",
            subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
            copyright: "天地图影像"
          });

          const vecAnnotationTileLayer = new WebTileLayer({
            urlTemplate: "http://{subDomain}.tianditu.com/DataServer?T=cva_w&x={col}&y={row}&l={level}",
            subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
            copyright: "天地图矢量"
          });

          const grayLayer = new TileLayer({
            url: "https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer",
          })

          const vecBasemap = new Basemap({
            baseLayers: [vectorTileLayer, vecAnnotationTileLayer],
            title: "天地矢量",
            thumbnailUrl: "https://www.arcgis.com/sharing/rest/content/items/fb84ad313bd3432983488ed1ba1d5bf3/info/thumbnail/ago_downloaded.png?f=json"
          });

          const imgBasemap = new Basemap({
            baseLayers: [rasterTileLayer, imgAnnotationTileLayer],
            title: "天地影像",
            thumbnailUrl: "https://www.arcgis.com/sharing/rest/content/items/25cefd52161e44b8a5eec87768f79079/info/thumbnail/thumbnail.jpeg?f=json"
          });

          const gray = new Basemap({
            baseLayers: [grayLayer],
            title: "灰色图",
            thumbnailUrl: "https://www.arcgis.com/sharing/rest/content/items/74e992f4fce3450aaf57a9a0df0007c3/info/thumbnail/cn_canvas.jpg?f=json"
          })

          //底图数组
          return [ESRIVectorBasemap, ESRIRasterBasemap, vecBasemap, imgBasemap, gray];
        }

        function AddLayerByJson() {
          //云南json图层
          var yunnanlayer = new GraphicsLayer({
            title: "云南省界图层"
          });
          // Create a symbol for rendering the graphic
          var fillSymbol = {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: [227, 139, 79, 0.8],
            outline: { // autocasts as new SimpleLineSymbol()
              color: [200, 200, 255],
              width: 3
            }
          };

          for (let i = 0; i < yunnanJson.features.length; i++) {
            // debugger
            let polygon = {
              type: "polygon", // autocasts as new Polygon()
              rings: yunnanJson.features[i].geometry.rings
            };
            let polygonGraphic = new Graphic({
              geometry: polygon,
              symbol: fillSymbol
            });

            yunnanlayer.add(polygonGraphic);
          }
          return yunnanlayer;
        }

        function AddLayerByOnline(layerid, func) {
          esriConfig.portalUrl = "http://www.arcgisonline.cn/arcgis";
          var portal = new Portal(); // Defaults to www.arcgis.com
          portal.load().then(function () {

            Layer.fromPortalItem({
                portalItem: { // autocasts as new PortalItem()
                  id: layerid,
                }
              }).then(initLayer)
              .catch(rejection);
          }); // Adds the layer to the map once it loads
          function initLayer(layer) {
            map.add(layer);
            // yunnanlayer = layer;
            // debugger

            layer.when(() => {
              if (func)
                func(layer);
            });
          }

          function rejection(error) {
            console.log("Layer failed to load: ", error);
          }
        }

        function InitWidget(layer) {
          self.view.goTo(layer.fullExtent);

          const homeWidget = new Home({
            view: self.view,
            viewpoint: new Viewpoint({
              targetGeometry: layer.fullExtent
            })
          });

          const basemapGallery = new BasemapGallery({
            view: self.view,
            container: document.createElement("div"),
            source: basemaps
          });

          const bgExpand = new Expand({
            view: self.view,
            content: basemapGallery.container,
            expandIconClass: "esri-icon-basemap"
          });

          //图层管理
          const layerList = new LayerList({
            view: self.view,
            listItemCreatedFunction: defineActions
          });

          function defineActions(event) {
            let item = event.item;    
            item.actionsSections = [
              [{
                title: "层级上升",
                className: "esri-icon-up-arrow",
                id: "level-up"
              }, {
                title: "层级下降",
                className: "esri-icon-down-arrow",
                id: "level-down"
              }],
              [{
                title: "缩放到图层",
                className: "esri-icon-zoom-out-fixed",
                id: "full-extent"
              }],
              [{
                title: "删除该图层",
                className: "esri-icon-close",
                id: "delete"
              }]
            ]
          }

          const layerExp = new Expand({
            view: self.view,
            content: layerList
          });

          const compass = new Compass({
            view: self.view,
            // viewpoint: new Viewpoint({
            //     targetGeometry: yunnanlayer.fullExtent
            // })
          });

          self.view.when(() => {
            layerList.on("trigger-action", function(event) {
              var layer = event.item.layer; //被选图层
              var id = event.action.id;     //被选操作
              var index = self.view.map.layers.items.indexOf(layer);
              
              switch(id) {
                case "level-down":
                  self.view.map.reorder(layer, index -1);
                  break;
                case "level-up":
                  self.view.map.reorder(layer, index + 1);
                  break;
                case "full-extent":
                  self.view.goTo(layer.fullExtent);
                  break;
                case "delete":
                  // self.view.map.remove(layer);
                  // self.
                  // console.log(layer.portalItem.id);
                  store.dispatch('RemoveEsriResources', layer.portalItem.id);
                  break;
                default:
                  break;
              }
            })
          })

          self.view.ui.add([{
              component: homeWidget,
              position: "top-left",
              index: 1
            },
            {
              component: bgExpand,
              position: "top-right",
              index: 0
            },
            {
              component: layerExp,
              position: "top-right",
              index: 1
            },
            {
              component: compass,
              position: "top-left",
              index: 2
            },
          ]);
        }

        //地图
        const map = new Map({
          basemap: 'satellite',
          // layers: [yunnanlayer] //,self.xbLayer,  gralayer
        });

        self.view = new MapView({
          map: map,
          container: 'map',
          // zoom: 7,
          // center: [101.0, 25.2],
        });   

        const basemaps = ConstructBasemap();

        // AddLayerByOnline("8fc2cf216b234ebda3fc87268f3e1173");
        // AddLayerByOnline("e750516c0b3742bd9b7307c80b0f76ca");
        // AddLayerByOnline("e57557968d434d5286554eaa90b29d61");
        // AddLayerByOnline("e6cb7992cf2347bbb3e1f13c4ce1ad03");
        // AddLayerByOnline("fb0c493d6e1446669862edc16f7a6eaf");
        AddLayerByOnline("a88b5dc3208049cc991ab64633b175d2", InitWidget);
        // AddLayerByOnline("5f58f6fe562c4aa59e1d9b470945377d");

        // AddLayerByOnline("2044c12a6d784ba89da3427a07ce9b93", InitWidget);
        // AddLayerByOnline("5f58f6fe562c4aa59e1d9b470945377d");

      })
    .catch(err => {
      console.error(err);
    });
}

export const AddLayer = function(esriLoader, options, view, layerID) {
  esriLoader.loadModules(
    [
      'esri/Map',
      "esri/Basemap",
      "esri/Viewpoint",
      "esri/Graphic",
      'esri/views/MapView',
      "esri/layers/Layer",
      "esri/layers/FeatureLayer",
      "esri/layers/WebTileLayer",
      "esri/layers/TileLayer",
      "esri/layers/GraphicsLayer",
      "esri/widgets/Expand",
      "esri/widgets/Home",
      "esri/widgets/LayerList",
      "esri/widgets/BasemapGallery",
      "esri/widgets/Legend",
      "esri/widgets/Compass",
      "esri/widgets/Print",
      "esri/core/urlUtils",
      "esri/config",
      "esri/portal/Portal"
    ], options)
    .then(
      ([
        Map,
        Basemap,
        Viewpoint,
        Graphic,
        MapView,
        Layer,
        FeatureLayer,
        WebTileLayer,
        TileLayer,
        GraphicsLayer,
        Expand,
        Home,
        LayerList,
        BasemapGallery,
        Legend,
        Compass,
        Print,
        urlUtils,
        esriConfig,
        Portal
      ]) => {
        esriConfig.portalUrl = "http://www.arcgisonline.cn/arcgis";
        var portal = new Portal(); // Defaults to www.arcgis.com
        portal.load().then(function () {
          // console.log(layerID);
          Layer.fromPortalItem({
              portalItem: { // autocasts as new PortalItem()
                id: layerID,
              }
            }).then(initLayer)
            .catch(rejection);
        }); // Adds the layer to the map once it loads
        function initLayer(layer) {
          view.map.add(layer);
          // yunnanlayer = layer;
          // debugger

          // layer.when(() => {
          //   if (func)
          //     func(layer);
          // });
        }

        function rejection(error) {
          console.log("Layer failed to load: ", error);
        }
      })
}