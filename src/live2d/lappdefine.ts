/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { LogLevel } from '@framework/live2dcubismframework';

/**
 * Sample Appで使用する定数
 */

// Canvas width and height pixel values, or dynamic screen size ('auto').
export const CanvasSize: { width: number; height: number } | 'auto' = 'auto';

// キャンバスの数
export const CanvasNum = 0;

// 画面
export const ViewScale = 1.0;
export const ViewMaxScale = 3.0;
export const ViewMinScale = 0.8;

export const ViewLogicalLeft = -1.0;
export const ViewLogicalRight = 1.0;
export const ViewLogicalBottom = -1.0;
export const ViewLogicalTop = 1.0;

export const ViewLogicalMaxLeft = -2.0;
export const ViewLogicalMaxRight = 2.0;
export const ViewLogicalMaxBottom = -2.0;
export const ViewLogicalMaxTop = 2.0;

// 相対パス
export const ResourcesPath = 'Resources/';

// モデルの後ろにある背景の画像ファイル
export const BackImageName = 'back_class_normal.png';

// 歯車
export const GearImageName = 'icon_gear.png';

// 終了ボタン
export const PowerImageName = 'CloseNormal.png';

// モデル定義---------------------------------------------
// モデルを配置したディレクトリ名の配列
// ディレクトリ名とmodel3.jsonの名前を一致させておくこと
export const ModelDir: string[] = [
  "CHA_Aminda_NPC_01",  
  "CHA_Andoris_SSR_01", 
  "CHA_AnshangQ_NPC_01",
  "CHA_Bathilda_NPC_01",
  "CHA_Berser_NPC_01",  
  "CHA_Bibi_NPC_01",    
  "CHA_Bibi_NPC_02",    
  "CHA_Bibi_NPC_03",
  "CHA_Biyoca_SSR_01",
  "CHA_Blusphere_NPC_01",
  "CHA_Blusphere_NPC_02",
  "CHA_Bowen_NPC_01",
  "CHA_CaptainKellen_NPC_01",
  "CHA_CensorLeo_NPC_01",
  "CHA_Centaureissi_SSR_01",
  "CHA_Charolic_Paradeus_01",
  "CHA_Charolic_Rest_01",
  "CHA_Charolic_SR_01",
  "CHA_Charolic_SSR_01",
  "CHA_Cheeta_SR_01",
  "CHA_Clukay_SSR_01",
  "CHA_Colphne_N_01",
  "CHA_Colphne_Paradeus_01",
  "CHA_Colphne_Rest_01",
  "CHA_Colphne_SR_01",
  "CHA_Consignor_NPC_01",
  "CHA_Crifium_NPC_01",
  "CHA_Daiyan_SSR_01",
  "CHA_Dandelion_NPC_01",
  "CHA_Dandelion_NPC_02",
  "CHA_Darcular_NPC_01",
  "CHA_Deele_NPC_01",
  "CHA_Dmitriy_NPC_01",
  "CHA_Dmitriy_Young_NPC_01",
  "CHA_Drachen_NPC_01",
  "CHA_Dusevnyj_SSR_01",
  "CHA_Esther_NPC_01",
  "CHA_Farkas_NPC_01",
  "CHA_Faye_SSR_01",
  "CHA_Flagg_NPC_01",
  "CHA_Groza_Paradeus_01",
  "CHA_Groza_Rest_01",
  "CHA_Groza_R_01",
  "CHA_Groza_SR_01",
  "CHA_Harpsy_SR_01",
  "CHA_Helena_NPC_01",
  "CHA_Helena_NPC_02",
  "CHA_Helena_NPC_03",
  "CHA_Helena_Paradeus_01",
  "CHA_Helianthus_NPC_01",
  "CHA_Inspector_NPC_01",
  "CHA_Ivan_NPC_01",
  "CHA_Jiangyu_NPC_01",
  "CHA_Kalina_NPC_01",
  "CHA_Koshmar_NPC_01",
  "CHA_Ksenia_SR_01",
  "CHA_Lampetia_NPC_01",
  "CHA_Lenna_SSR_01",
  "CHA_Lenna_SSR_02",
  "CHA_Lenten_NPC_01",
  "CHA_Levva_NPC_01",
  "CHA_Liaison_NPC_01",
  "CHA_Lieutenant_NPC_01",
  "CHA_Lind_SSR_01",
  "CHA_Littara_SR_01",
  "CHA_Loring_NPC_01",
  "CHA_Lotta_SR_01",
  "CHA_Lumi_NPC_01",
  "CHA_Macqiato_SSR_01",
  "CHA_Macqiato_SSR_02",
  "CHA_MangiEmployee_NPC_01",
  "CHA_MangiKnellA_NPC_01",
  "CHA_MangiKnellB_NPC_01",
  "CHA_MangiKnellC_NPC_01",
  "CHA_MangiKnellD_NPC_01",
  "CHA_MAwomen_NPC_01",
  "CHA_Mayling_NPC_01",
  "CHA_Mechty_SSR_01",
  "CHA_Mopro1.5_NPC_01",
  "CHA_Mosinnagant_SSR_01",
  "CHA_MysteryMan_NPC_01",
  "CHA_Nagant_SR_01",
  "CHA_Nemesis_Paradeus_01",
  "CHA_Nemesis_Rest_01",
  "CHA_Nemesis_R_01",
  "CHA_Nemesis_SR_01",
  "CHA_Nikolay_NPC_01",
  "CHA_Niter_NPC_01",
  "CHA_Nyto_NPC_01",
  "CHA_Papasha_SSR_01",
  "CHA_Peritya_SSR_01",
  "CHA_Peri_SSR_01",
  "CHA_Persicaria_NPC_01",
  "CHA_Poludnitsa_NPC_01",
  "CHA_Qiongjiu_SSR_01",
  "CHA_Qiuhua_SSR_01",
  "CHA_RegularDoll_NPC_01",
  "CHA_RNDmale_NPC_01",
  "CHA_RNDmale_NPC_02",
  "CHA_Rosaline_NPC_01",
  "CHA_Ruchey_SSR_01",
  "CHA_Sabrina_SSR_01",
  "CHA_Saga_NPC_01",
  "CHA_Sexdwarf_NPC_01",
  "CHA_Sexdwarf_Paradeus_01",
  "CHA_Sharkry_SR_01",
  "CHA_Sharkry_SSR_01",
  "CHA_Soldier01_NPC_01",
  "CHA_Soldier01_NPC_02",
  "CHA_Springfield_NPC_01",
  "CHA_Springfield_NPC_SP",
  "CHA_Springfield_SSR_01",
  "CHA_Suomi_Rest_01",
  "CHA_Suomi_SSR_01",
  "CHA_Tololo_SSR_01",
  "CHA_Ullrid_SSR_01",
  "CHA_Unitas_NPC_01",
  "CHA_Unitas_NPC_02",
  "CHA_Ussery_NPC_01",
  "CHA_Vector_SSR_01",
  "CHA_Vepley_Paradeus_01",
  "CHA_Vepley_Rest_01",
  "CHA_Vepley_SR_01",
  "CHA_Vepley_SSR_01",
  "CHA_Vladimir_NPC_01",
  "CHA_Welrod_SSR_01",
  "CHA_Yoohee_SSR_01",
  "CHA_Zhaohui_SSR_01",
];
export const ModelDirSize: number = ModelDir.length;

export function getAvailableModels(): string[] {
  return ModelDir;
}

// 外部定義ファイル（json）と合わせる
export const MotionGroupIdle = 'Idle'; // アイドリング
export const MotionGroupTapBody = 'TapBody'; // 体をタップしたとき

// 外部定義ファイル（json）と合わせる
export const HitAreaNameHead = 'Head';
export const HitAreaNameBody = 'Body';

// モーションの優先度定数
export const PriorityNone = 0;
export const PriorityIdle = 1;
export const PriorityNormal = 2;
export const PriorityForce = 3;

// MOC3の一貫性検証オプション
export const MOCConsistencyValidationEnable = true;

// デバッグ用ログの表示オプション
export const DebugLogEnable = true;
export const DebugTouchLogEnable = false;

// Frameworkから出力するログのレベル設定
export const CubismLoggingLevel: LogLevel = LogLevel.LogLevel_Verbose;

// デフォルトのレンダーターゲットサイズ
export const RenderTargetWidth = 1900;
export const RenderTargetHeight = 1000;
