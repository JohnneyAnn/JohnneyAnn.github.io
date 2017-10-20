 /**
 * 模拟从数据库拿到数据后，对数据进行处理并使用ER图展示
 * @Author iamanyang.com
 * @param tableNum 需要创建的表数
 * @description
 *     getRandomNum(n,m)  获取(n,m)区间随机整数，用于自动生成字段数
 *     createNodesData(tNum) 根据给定的表数生成表节点，为每个表生成随机的字段数,返回一个数据模型（字段节点与表节点）
 *     createEdgesData（model）生成字段间关系，由于字段是随机生成的，这里只自动生成表0字段0与其他表中最后一个字段的关系，使用的模型为createNodesData生成的
 *     figureNodesPosition(model) 计算字段节点位置用于画图，可自定义行数与列数，此处模型与createEdgesData使用的模型一致，由于字段随机生成，为保证模型一致，在此方法里调用了createEdgesData，最终返回包含节点与线的对象
 *     paintCytoER(datas) 画图方法，将数据放入生成cy图
 *     Tips: 模拟：本demo只是为了模拟，具体方法需根据具体数据来定，方法figureNodesPosition计算位置在给定正确结构的数据模型可直接使用
 *          事件操作：鼠标左键单击查看当前字段关系，右键关闭当前字段关系，本demo只有表0字段0有关系，将数据正确接入即可
 */
(function (tableNum,fRow,fCol) {
  var _ = function(){
    return {
      getRandomNum : function(n,m){
        return Math.floor(Math.random()*(m-n+1)+n);
      },
      createNodesData : function(tNum){
        var model = {
          tableNodes:[],
          fieldNodes:{}
        };
        for(var i = 0; i < tNum; i++){
          var node = { id:'t'+i, name:'表'+i };
          var param = { data: node };
          model.tableNodes.push(param);
        }
        for(var i = 0; i < tNum; i++){
          model.fieldNodes['t'+i]=[];
          for(var j = 0; j < _.getRandomNum(1,80); j++){
            var node = { id:'t'+i+'-f'+j, name:'t'+i+'字段'+j };
            var param = { data: node };
            model.fieldNodes['t'+i].push(param);
          }
        }
        return model;
      },
      createEdgesData : function(model){
        var edgesER = [];
        for(var i = 0; i < model.tableNodes.length; i++){
          var edge = { source:model.fieldNodes[model.tableNodes[i].data.id][model.fieldNodes[model.tableNodes[i].data.id].length-1].data.id,
                       target:model.fieldNodes[model.tableNodes[0].data.id][0].data.id }
          var param = { data:edge, classes:'fieldRelation' };
          edgesER.push(param);
        }
        return edgesER;
      },
      figureNodesPosition : function(model,fRow,fCol){
        var nodesER = [];
        nodesER.push({data: { id: 'main', name: 'ER图' }});
        var fieldXOffset = 0,fieldYOffset = 40,fieldRow = fRow,fieldCol = fCol;
        var maxX = 0,maxY = 0,entityXOffset=200;
        var outLoopNum = 0,cols=0;
        for(var i = 0; i < model.tableNodes.length; i++){
          cols += parseInt(model.fieldNodes[model.tableNodes[i].data.id].length/fieldRow)+1;
          model.tableNodes[i].data.parent = 'main';
          nodesER.push(model.tableNodes[i]);
          var tempJ = 0 ;
          var innerLoopNum = 0;
          for(var j = 0; j<model.fieldnodes[model.tablenodes[i].data.id].length; j++){="" if(parseint((j="" fieldrow)-innerloopnum)="=1){//字段切换到下一列" fieldxoffset="180*(++innerLoopNum);" tempj="0;" }="" model.fieldnodes[model.tablenodes[i].data.id][j].data.parent="model.tableNodes[i].data.id;" model.fieldnodes[model.tablenodes[i].data.id][j].classes="cyField" ;="" model.fieldnodes[model.tablenodes[i].data.id][j].position="{" x:="" maxx+fieldxoffset,="" y:="" maxy+fieldyoffset*tempj="" };="" tempj++;="" nodeser.push(model.fieldnodes[model.tablenodes[i].data.id][j]);="" if(innerloopnum="=0){//若只够画一列，仍需偏移" maxx="maxX+entityXOffset;" }else{="" 否则记录上一个实体最后一个字段的x="" if(cols="">fieldCol){//实体切换到下一行
              fieldXOffset = 0;
              maxX = 0;
              maxY=fieldYOffset*fieldRow*(++outLoopNum)+120*outLoopNum;
              cols = 0;
          }
        }
        return { nodes: nodesER, edges: _.createEdgesData(model)};
      },
      paintCytoER : function(datas){
        var cy = cytoscape({
          container: document.getElementById('cy'),
          minZoom : 0.5,
          maxZoom : 1.5,
          userZoomingEnabled: true,
          userPanningEnabled:true,
          wheelSensitivity : 0.1,
          style: cytoscape.stylesheet()
            .selector('node')
              .css({
                'shape': 'roundrectangle',
                'content': 'data(name)',
                'text-valign': 'center',
                'color': 'white',
                'text-outline-width': 3,
                'text-outline-color': '#888',
                'font-size' : '8px',
                'width': 100,
                'height': 30,
                'background-color': '#93CDDD',
                'text-outline-color': '#93CDDD',
              })
            // .selector('edge')
            //   .css({
            //     'content': 'data(name)',
            //     'width': 1,
            //     'line-color': '#888',
            //     'target-arrow-color': '#888',
            //     'source-arrow-color': '#888',
            //     'target-arrow-shape': 'triangle-backcurve',
            //     'target-arrow-fill' : 'filled',
            //     'curve-style' : 'bezier',//路线
            //   })
            .selector('.fieldRelation')//血缘线
              .css({
                  'content': 'data(name)',
                  'width': 1,
                  "color" : "#FFFF00",
                  'font-family': "Microsoft YaHei",
                  'font-size' : '10px',
                  'line-color': 'red',
                  'target-arrow-color': 'red',
                  'source-arrow-color': 'red',
                  'curve-style' : 'bezier',//路线,箭头不会被覆盖
                  'line-style' : 'dashed',//线的样式
                  'target-arrow-shape': 'triangle-backcurve',
                  'target-arrow-fill' : 'filled',
                  'text-background-opacity' : 0,
              })
            .selector('$node > node')//小节点外面的框
              .css({
                'shape': 'roundrectangle',
                'text-valign': 'top',
                // 'height': 'auto',
                // 'width': 'auto',
                'background-color': '#ccc',
                'background-opacity': 0.333,
                'color': '#888',
                'text-outline-width':0,
                'font-size': 15
              })
            .selector(':selected')//选中
              .css({
                'background-color': '#00BFFF',
                'line-color': '#00BFFF',
                'target-arrow-color': '#00BFFF',
                'source-arrow-color': '#00BFFF',
                'text-outline-color': '#00BFFF'
              })
            .selector('#main')
              .css({
                'background-opacity': 0,
                'border-width': 1,
                'border-color': '#aaa',
                'border-opacity': 0.5,
                'font-size': 30,
                'padding-top': 40,
                'padding-left': 40,
                'padding-bottom': 40,
                'padding-right': 40,
              }),
          elements: {
            nodes: datas.nodes,
            edges: []
          },
          layout: {
            name: 'preset'
          }
        }).off('click').on('click','.cyField',function(e){//左键展开
                //关闭存在的关系  目前只有表0的字段0有关系
                if(e.target.id()=='t0-f0'){
                  cy.remove('.fieldRelation');
                  cy.add(datas.edges);
                }
                
            }).off('cxttap').on('cxttap','node',function(e){//右键关闭
                if(e.target.id()=='t0-f0'){
                  cy.remove('.fieldRelation');
                }
            });
        return cy;
      }
    };
  }();
  _.paintCytoER(
    _.figureNodesPosition(
      _.createNodesData(tableNum),fRow,fCol
    )
  );
})(10,10,8);//表数，每个实体的字段行数，每行的字段列数，</model.fieldnodes[model.tablenodes[i].data.id].length;>