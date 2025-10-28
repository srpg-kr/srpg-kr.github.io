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
export const ResourcesPath = '../Resources/';

// モデルの後ろにある背景の画像ファイル
export const BackImageName = 'back_class_normal.png';

// 歯車
export const GearImageName = 'icon_gear.png';

// 終了ボタン
export const PowerImageName = 'CloseNormal.png';

// モデル定義---------------------------------------------
// モデルを配置したディレクトリ名の配列
// ディレクトリ名とmodel3.jsonの名前を一致させておくこと
export const ModelDir_GFL2: string[] = [
    "CHA_6P62_BOSS_01",
    "CHA_Acicular_NPC_01",
    "CHA_AK12_NPC_01",
    "CHA_Alf_SSR_01",
    "CHA_Aminda_NPC_01",
    "CHA_Andoris_SSR_01",
    "CHA_Ange_NPC_01",
    "CHA_Ange_Suit_01",
    "CHA_AnshangQ_NPC_01",
    "CHA_Bathilda_NPC_01",
    "CHA_Berser_NPC_01",
    "CHA_Bibi_NPC_01",
    "CHA_Bibi_NPC_02",
    "CHA_Bibi_NPC_03",
    "CHA_Biyoca_SSR_01",
    "CHA_BlackGroza_NPC_01",
    "CHA_Blusphere_NPC_01",
    "CHA_Blusphere_NPC_02",
    "CHA_Bowen_NPC_01",
    "CHA_CaptainKellen_NPC_01",
    "CHA_Carmen_NPC_01",
    "CHA_CensorLeo_NPC_01",
    "CHA_Centaureissi_SSR_01",
    "CHA_Charolic_Paradeus_01",
    "CHA_Charolic_Rest_01",
    "CHA_Charolic_SR_01",
    "CHA_Charolic_SSR_01",
    "CHA_Cheeta_SR_01",
    "CHA_Chiloveig_NPC_01",
    "CHA_Chiloveig_NPC_02",
    "CHA_Clukay_SSR_01",
    "CHA_Cocoon_NPC_01",
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
    "CHA_Davey_NPC_01",
    "CHA_Deele_NPC_01",
    "CHA_Dmitriy_NPC_01",
    "CHA_Dmitriy_Young_NPC_01",
    "CHA_Drachen_NPC_01",
    "CHA_Dusevnyj_SSR_01",
    "CHA_Elnida_NPC_01",
    "CHA_Esther_NPC_01",
    "CHA_Fadei_NPC_01",
    "CHA_Farkas_NPC_01",
    "CHA_Faye_SSR_01",
    "CHA_Flagg_NPC_01",
    "CHA_Florence_SSR_01",
    "CHA_G11_Suit_MaidUniform",
    "CHA_Green_NormalBoy01_NPC_01",
    "CHA_Green_NormalFemale01_NPC_01",
    "CHA_Green_NormalGirl01_NPC_01",
    "CHA_Green_NormalMale01_NPC_01",
    "CHA_Green_RichBoy01_NPC_01",
    "CHA_Green_RichFemale01_NPC_01",
    "CHA_Green_RichGirl01_NPC_01",
    "CHA_Green_RichMale01_NPC_01",
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
    "CHA_Inessa_NPC_01",
    "CHA_Inspector_NPC_01",
    "CHA_Isha_NPC_01",
    "CHA_Ivan_NPC_01",
    "CHA_Jiangyu_NPC_01",
    "CHA_Kalina_NPC_01",
    "CHA_Kalina_Suit_01",
    "CHA_Karl_NPC_01",
    "CHA_Koshmar_NPC_01",
    "CHA_Kryuger_NPC_01",
    "CHA_Ksenia_SR_01",
    "CHA_Laibnis_NPC_01",
    "CHA_Lampetia_NPC_01",
    "CHA_Lene_SSR_01",
    "CHA_Lene_Suit_ump40_01",
    "CHA_Lenna_SSR_01",
    "CHA_Lenna_SSR_02",
    "CHA_Lenna_Suit_01",
    "CHA_Lenten_NPC_01",
    "CHA_Levva_NPC_01",
    "CHA_Levva_SSR_01",
    "CHA_Levva_Suit_ump45_01",
    "CHA_Levva_Suit_ump45_02",
    "CHA_Liaison_NPC_01",
    "CHA_Lieutenant_NPC_01",
    "CHA_Lind_SSR_01",
    "CHA_Littara_SR_01",
    "CHA_Lonnie_NPC_01",
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
    "CHA_Nikita_SSR_01",
    "CHA_Nikolay_NPC_01",
    "CHA_Niter_NPC_01",
    "CHA_Nyto_NPC_01",
    "CHA_Orpheoreon_NPC_01",
    "CHA_Orpheoreon_NPC_02",
    "CHA_Orphina_NPC_01",
    "CHA_Papasha_SSR_01",
    "CHA_Pavel_NPC_01",
    "CHA_Peritya_SSR_01",
    "CHA_Peri_SSR_01",
    "CHA_Persicaria_NPC_01",
    "CHA_Poludnitsa_NPC_01",
    "CHA_Qiongjiu_SSR_01",
    "CHA_Qiuhua_SSR_01",
    "CHA_RegularDoll_NPC_01",
    "CHA_RNDmale_NPC_01",
    "CHA_RNDmale_NPC_02",
    "CHA_Robella_SSR_01",
    "CHA_Rosaline_NPC_01",
    "CHA_RPK-16_NPC_01",
    "CHA_Ruchey_SSR_01",
    "CHA_Rurik_NPC_01",
    "CHA_Sabrina_SSR_01",
    "CHA_Saga_NPC_01",
    "CHA_Seele_NPC_01",
    "CHA_Sexdwarf_NPC_01",
    "CHA_Sexdwarf_Paradeus_01",
    "CHA_Sharkry_SR_01",
    "CHA_Sharkry_SSR_01",
    "CHA_Soldier01_NPC_01",
    "CHA_Soldier01_NPC_02",
    "CHA_Sop_NPC_01",
    "CHA_Springfield_NPC_01",
    "CHA_Springfield_NPC_SP",
    "CHA_Springfield_SSR_01",
    "CHA_Suomi_Rest_01",
    "CHA_Suomi_SSR_01",
    "CHA_Tololo_SSR_01",
    "CHA_Ullrid_SSR_01",
    "CHA_Unitas_NPC_01",
    "CHA_Unitas_NPC_02",
    "CHA_UnsearchableGirl_NPC_01",
    "CHA_URNCofficer_NPC_01",
    "CHA_Ussery_NPC_01",
    "CHA_Vector_SSR_01",
    "CHA_Vepley_Paradeus_01",
    "CHA_Vepley_Rest_01",
    "CHA_Vepley_SR_01",
    "CHA_Vepley_SSR_01",
    "CHA_Vladimir_NPC_01",
    "CHA_Voymastina_SSR_01",
    "CHA_Welrod_SSR_01",
    "CHA_WomanA_NPC_01",
    "CHA_Yakov_NPC_01",
    "CHA_Yellow_NormalBoy01_NPC_01",
    "CHA_Yellow_NormalFemale01_NPC_01",
    "CHA_Yellow_NormalGirl01_NPC_01",
    "CHA_Yellow_NormalMale01_NPC_01",
    "CHA_Yoohee_SSR_01",
    "CHA_Zhaohui_SSR_01",
    "CHA_Zimmermann_NPC_01",
    "CHA_Zimmermann_NPC_02",
];

export const ModelDir_StellarSora: string[] = [
  "StellarSora/assets/assetbundles/actor2d/character/10301/10301_l/10301_L",
  "StellarSora/assets/assetbundles/actor2d/character/10301/10301_lf/10301_F",
  "StellarSora/assets/assetbundles/actor2d/character/10301/10301_lt/10301_T",
  "StellarSora/assets/assetbundles/actor2d/character/10302/10302_l/10302_L",
  "StellarSora/assets/assetbundles/actor2d/character/10701/10701_l/10701_L",
  "StellarSora/assets/assetbundles/actor2d/character/10701/10701_lf/10701_F",
  "StellarSora/assets/assetbundles/actor2d/character/10701/10701_lt/10701_T",
  "StellarSora/assets/assetbundles/actor2d/character/10702/10702_l/10702_L",
  "StellarSora/assets/assetbundles/actor2d/character/10801/10801_l/10801_L",
  "StellarSora/assets/assetbundles/actor2d/character/10801/10801_lf/10801_F",
  "StellarSora/assets/assetbundles/actor2d/character/10801/10801_lt/10801_T",
  "StellarSora/assets/assetbundles/actor2d/character/10802/10802_l/10802_L",
  "StellarSora/assets/assetbundles/actor2d/character/11101/11101_l/11101_L",
  "StellarSora/assets/assetbundles/actor2d/character/11101/11101_lf/11101_F",
  "StellarSora/assets/assetbundles/actor2d/character/11101/11101_lt/11101_T",
  "StellarSora/assets/assetbundles/actor2d/character/11102/11102_l/11102_L",
  "StellarSora/assets/assetbundles/actor2d/character/11201/11201_l/11201_L",
  "StellarSora/assets/assetbundles/actor2d/character/11201/11201_lf/11201_F",
  "StellarSora/assets/assetbundles/actor2d/character/11201/11201_lt/11201_T",
  "StellarSora/assets/assetbundles/actor2d/character/11202/11202_l/11202_L",
  "StellarSora/assets/assetbundles/actor2d/character/11203/11203_l/11203_L",
  "StellarSora/assets/assetbundles/actor2d/character/11301/11301_l/11301_L",
  "StellarSora/assets/assetbundles/actor2d/character/11301/11301_lf/11301_F",
  "StellarSora/assets/assetbundles/actor2d/character/11301/11301_lt/11301_T",
  "StellarSora/assets/assetbundles/actor2d/character/11302/11302_l/11302_L",
  "StellarSora/assets/assetbundles/actor2d/character/11601/11601_l/11601_L",
  "StellarSora/assets/assetbundles/actor2d/character/11601/11601_lf/11601_F",
  "StellarSora/assets/assetbundles/actor2d/character/11601/11601_lt/11601_T",
  "StellarSora/assets/assetbundles/actor2d/character/11602/11602_l/11602_L",
  "StellarSora/assets/assetbundles/actor2d/character/11701/11701_l/11701_L",
  "StellarSora/assets/assetbundles/actor2d/character/11701/11701_lf/11701_F",
  "StellarSora/assets/assetbundles/actor2d/character/11701/11701_lt/11701_T",
  "StellarSora/assets/assetbundles/actor2d/character/11702/11702_l/11702_L",
  "StellarSora/assets/assetbundles/actor2d/character/11801/11801_l/11801_L",
  "StellarSora/assets/assetbundles/actor2d/character/11801/11801_lf/11801_F",
  "StellarSora/assets/assetbundles/actor2d/character/11801/11801_lt/11801_T",
  "StellarSora/assets/assetbundles/actor2d/character/11802/11802_l/11802_L",
  "StellarSora/assets/assetbundles/actor2d/character/11901/11901_l/11901_L",
  "StellarSora/assets/assetbundles/actor2d/character/11901/11901_lf/11901_lf_a/11901_F_a",
  "StellarSora/assets/assetbundles/actor2d/character/11901/11901_lf/11901_lf_b/11901_F_b",
  "StellarSora/assets/assetbundles/actor2d/character/11901/11901_lf/11901_lf_c/11901_F_c",
  "StellarSora/assets/assetbundles/actor2d/character/11901/11901_lt/11901_T",
  "StellarSora/assets/assetbundles/actor2d/character/11902/11902_l/11902_L",
  "StellarSora/assets/assetbundles/actor2d/character/12001/12001_l/12001_L",
  "StellarSora/assets/assetbundles/actor2d/character/12001/12001_lf/12001_F_a",
  "StellarSora/assets/assetbundles/actor2d/character/12001/12001_lf/12001_F_b",
  "StellarSora/assets/assetbundles/actor2d/character/12001/12001_lf/12001_lf_a/12001_F_a",
  "StellarSora/assets/assetbundles/actor2d/character/12001/12001_lf/12001_lf_b/12001_F_b",
  "StellarSora/assets/assetbundles/actor2d/character/12001/12001_lt/12001_T",
  "StellarSora/assets/assetbundles/actor2d/character/12002/12002_l/12002_L",
  "StellarSora/assets/assetbundles/actor2d/character/12301/12301_l/12301_L",
  "StellarSora/assets/assetbundles/actor2d/character/12301/12301_lf/12301_F",
  "StellarSora/assets/assetbundles/actor2d/character/12301/12301_lt/12301_T",
  "StellarSora/assets/assetbundles/actor2d/character/12302/12302_l/12302_L",
  "StellarSora/assets/assetbundles/actor2d/character/12501/12501_l/12501_L",
  "StellarSora/assets/assetbundles/actor2d/character/12501/12501_lf/12501_lf_a/12501_F_a",
  "StellarSora/assets/assetbundles/actor2d/character/12501/12501_lf/12501_lf_b/12501_F_b",
  "StellarSora/assets/assetbundles/actor2d/character/12501/12501_lt/12501_T",
  "StellarSora/assets/assetbundles/actor2d/character/12502/12502_l/12502_L",
  "StellarSora/assets/assetbundles/actor2d/character/12601/12601_l/12601_L",
  "StellarSora/assets/assetbundles/actor2d/character/12601/12601_lf/12601_F",
  "StellarSora/assets/assetbundles/actor2d/character/12601/12601_lt/12601_T",
  "StellarSora/assets/assetbundles/actor2d/character/12602/12602_l/12602_L",
  "StellarSora/assets/assetbundles/actor2d/character/12701/12701_l/12701_L",
  "StellarSora/assets/assetbundles/actor2d/character/12701/12701_lf/12701_F",
  "StellarSora/assets/assetbundles/actor2d/character/12701/12701_lt/12701_T",
  "StellarSora/assets/assetbundles/actor2d/character/12702/12702_l/12702_L",
  "StellarSora/assets/assetbundles/actor2d/character/13201/13201_l/13201_L",
  "StellarSora/assets/assetbundles/actor2d/character/13201/13201_lf/13201_lf_a/13201_F_a",
  "StellarSora/assets/assetbundles/actor2d/character/13201/13201_lf/13201_lf_b/13201_F_b",
  "StellarSora/assets/assetbundles/actor2d/character/13201/13201_lt/13201_T",
  "StellarSora/assets/assetbundles/actor2d/character/13202/13202_l/13202_l_a/13202_L_a",
  "StellarSora/assets/assetbundles/actor2d/character/13202/13202_l/13202_l_b/13202_L_b",
  "StellarSora/assets/assetbundles/actor2d/character/13203/13203_l/13203_L",
  "StellarSora/assets/assetbundles/actor2d/character/13501/13501_l/13501_L",
  "StellarSora/assets/assetbundles/actor2d/character/13501/13501_lf/13501_lf_a/13501_F_a",
  "StellarSora/assets/assetbundles/actor2d/character/13501/13501_lf/13501_lf_b/13501_F_b",
  "StellarSora/assets/assetbundles/actor2d/character/13501/13501_lt/13501_T",
  "StellarSora/assets/assetbundles/actor2d/character/13502/13502_l/13502_L",
  "StellarSora/assets/assetbundles/actor2d/character/13701/13701_l/ailinuo",
  "StellarSora/assets/assetbundles/actor2d/character/14101/14101_l/14101_L",
  "StellarSora/assets/assetbundles/actor2d/character/14101/14101_lf/14101_lf_a/14101_F_a",
  "StellarSora/assets/assetbundles/actor2d/character/14101/14101_lf/14101_lf_b/14101_F_b",
  "StellarSora/assets/assetbundles/actor2d/character/14101/14101_lt/14101_T",
  "StellarSora/assets/assetbundles/actor2d/character/14102/14102_l/14102_L",
  "StellarSora/assets/assetbundles/actor2d/character/14201/14201_l/14201_L",
  "StellarSora/assets/assetbundles/actor2d/character/14201/14201_lf/14201_F",
  "StellarSora/assets/assetbundles/actor2d/character/14201/14201_lt/14201_T",
  "StellarSora/assets/assetbundles/actor2d/character/14202/14202_l/14202_L",
  "StellarSora/assets/assetbundles/actor2d/character/14401/14401_l/14401_L",
  "StellarSora/assets/assetbundles/actor2d/character/14401/14401_lf/14401_lf_a/14401_F_a",
  "StellarSora/assets/assetbundles/actor2d/character/14401/14401_lf/14401_lf_b/14401_F_b",
  "StellarSora/assets/assetbundles/actor2d/character/14401/14401_lt/14401_T",
  "StellarSora/assets/assetbundles/actor2d/character/14402/14402_l/14402_L",
  "StellarSora/assets/assetbundles/actor2d/character/14701/14701_l/14701_L",
  "StellarSora/assets/assetbundles/actor2d/character/14701/14701_lf/14701_lf_a/14701_F_a",
  "StellarSora/assets/assetbundles/actor2d/character/14701/14701_lf/14701_lf_b/14701_F_b",
  "StellarSora/assets/assetbundles/actor2d/character/14701/14701_lt/14701_T",
  "StellarSora/assets/assetbundles/actor2d/character/14702/14702_l/14702_L",
  "StellarSora/assets/assetbundles/actor2d/character/14901/14901_l/14901_L",
  "StellarSora/assets/assetbundles/actor2d/character/14901/14901_lf/14901_lf_a/14901_F_a",
  "StellarSora/assets/assetbundles/actor2d/character/14901/14901_lf/14901_lf_b/14901_F_b",
  "StellarSora/assets/assetbundles/actor2d/character/14901/14901_lt/14901_T",
  "StellarSora/assets/assetbundles/actor2d/character/14902/14902_l/14902_L",
  "StellarSora/assets/assetbundles/actor2d/character/15001/15001_l/15001_L",
  "StellarSora/assets/assetbundles/actor2d/character/15001/15001_lf/15001_lf_a/15001_F_a",
  "StellarSora/assets/assetbundles/actor2d/character/15001/15001_lf/15001_lf_b/15001_F_b",
  "StellarSora/assets/assetbundles/actor2d/character/15001/15001_lt/15001_T",
  "StellarSora/assets/assetbundles/actor2d/character/15002/15002_l/15002_L",
  "StellarSora/assets/assetbundles/actor2d/character/15501/15501_l/15501_L",
  "StellarSora/assets/assetbundles/actor2d/character/15501/15501_lf/15501_lf_a/15501_F_a",
  "StellarSora/assets/assetbundles/actor2d/character/15501/15501_lf/15501_lf_b/15501_F_b",
  "StellarSora/assets/assetbundles/actor2d/character/15501/15501_lt/15501_T",
  "StellarSora/assets/assetbundles/actor2d/character/15502/15502_l/15502_L",
  "StellarSora/assets/assetbundles/actor2d/character/15601/15601_l/15601_L",
  "StellarSora/assets/assetbundles/actor2d/character/15601/15601_lf/15601_lf_a/15601_F_a",
  "StellarSora/assets/assetbundles/actor2d/character/15601/15601_lf/15601_lf_b/15601_F_b",
  "StellarSora/assets/assetbundles/actor2d/character/15601/15601_lt/15601_T",
  "StellarSora/assets/assetbundles/actor2d/character/15602/15602_l/15602_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_103/avg1_103/10301_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_103/avg1_103_a/10301_F",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_106/avg1_106/jiguang",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_107/avg1_107/10701_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_107/avg1_107_a/10701_F",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_108/avg1_108/10801_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_108/avg1_108_a/10801_F",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_109/avg1_109/qingye",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_109/avg1_109_a/qingye_CG",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_110/avg1_110/11001_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_110/avg1_110_a/avg1_110_a_a/11001_F_a",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_110/avg1_110_a/avg1_110_a_b/11001_F_b",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_111/avg1_111/11101_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_111/avg1_111_a/11101_F",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_112/avg1_112/11201_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_112/avg1_112_a/11201_F",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_113/avg1_113/11301_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_113/avg1_113_a/11301_F",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_115/avg1_115/11501_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_115/avg1_115_a/avg1_115_a_a/11501_F_a",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_115/avg1_115_a/avg1_115_a_b/11501_F_b",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_116/avg1_116/11601_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_116/avg1_116_a/11601_F",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_117/avg1_117/11701_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_117/avg1_117_a/11701_F",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_118/avg1_118/11801_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_118/avg1_118_a/11801_F",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_119/avg1_119/11901_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_119/avg1_119_a/avg1_119_a_a/11901_F_a",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_119/avg1_119_a/avg1_119_a_b/11901_F_b",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_119/avg1_119_a/avg1_119_a_c/11901_F_c",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_120/avg1_120/12001_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_120/avg1_120_a/12001_F_a",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_120/avg1_120_a/12001_F_b",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_120/avg1_120_a/avg1_120_a_a/12001_F_a",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_120/avg1_120_a/avg1_120_a_b/12001_F_b",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_123/avg1_123/12301_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_123/avg1_123_a/12301_F",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_125/avg1_125/12501_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_125/avg1_125_a/avg1_125_a_a/12501_F_a",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_125/avg1_125_a/avg1_125_a_b/12501_F_b",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_126/avg1_126/12601_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_126/avg1_126_a/12601_F",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_127/avg1_127/12701_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_127/avg1_127_a/12701_F",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_130/avg1_130/13001_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_130/avg1_130_a/avg1_130_a_a/13001_F_a",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_130/avg1_130_a/avg1_130_a_b/13001_F_b",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_132/avg1_132/13201_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_132/avg1_132_a/avg1_132_a_a/13201_F_a",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_132/avg1_132_a/avg1_132_a_b/13201_F_b",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_133/avg1_133/13301_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_133/avg1_133_a/avg1_133_a_a/13301_F_a",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_133/avg1_133_a/avg1_133_a_b/13301_F_b",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_134/avg1_134/13401_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_134/avg1_134_a/avg1_134_a_a/13401_F_a",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_134/avg1_134_a/avg1_134_a_b/13401_F_b",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_135/avg1_135/13501_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_135/avg1_135_a/avg1_135_a_a/13501_F_a",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_135/avg1_135_a/avg1_135_a_b/13501_F_b",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_137/avg1_137/ailinuo",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_141/avg1_141/14101_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_141/avg1_141_a/avg1_141_a_a/14101_F_a",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_141/avg1_141_a/avg1_141_a_b/14101_F_b",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_142/avg1_142/14201_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_142/avg1_142_a/14201_F",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_143/avg1_143/14301_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_143/avg1_143_a/avg1_143_a_a/14301_F_a",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_143/avg1_143_a/avg1_143_a_b/14301_F_b",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_144/avg1_144/14401_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_144/avg1_144_a/avg1_144_a_a/14401_F_a",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_144/avg1_144_a/avg1_144_a_b/14401_F_b",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_147/avg1_147/14701_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_147/avg1_147_a/avg1_147_a_a/14701_F_a",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_147/avg1_147_a/avg1_147_a_b/14701_F_b",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_149/avg1_149/14901_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_149/avg1_149_a/avg1_149_a_a/14901_F_a",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_149/avg1_149_a/avg1_149_a_b/14901_F_b",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_150/avg1_150/15001_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_150/avg1_150_a/avg1_150_a_a/15001_F_a",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_150/avg1_150_a/avg1_150_a_b/15001_F_b",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_155/avg1_155/15501_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_155/avg1_155_a/avg1_155_a_a/15501_F_a",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_155/avg1_155_a/avg1_155_a_b/15501_F_b",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_156/avg1_156/15601_L",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_156/avg1_156_a/avg1_156_a_a/15601_F_a",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg1_156/avg1_156_a/avg1_156_a_b/15601_F_b",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg3_100/live2d_a/moc/avg3_100_a/avg3_100_a",
  "StellarSora/assets/assetbundles/actor2d/characteravg/avg3_101/live2d_a/moc/avg3_101_a/avg3_101_a",
  "StellarSora/assets/assetbundles/actor2d/npc/910201/910201_l/910201_L",
  "StellarSora/assets/assetbundles/actor2d/npc/910202/910202_l/910202_L",
  "StellarSora/assets/assetbundles/actor2d/npc/913101/913101_l/913101_L",
  "StellarSora/assets/assetbundles/actor2d/npc/913301/913301_l/913301_L",
  "StellarSora/assets/assetbundles/actor2d/npc/915501/15501_l/15501_L",
  "StellarSora/assets/assetbundles/actor2d/npc/915501/15501_lf/15501_lf_a/15501_F_a",
  "StellarSora/assets/assetbundles/actor2d/npc/915501/15501_lf/15501_lf_b/15501_F_b",
  "StellarSora/assets/assetbundles/actor2d/npc/915901/915901_l/915901_L",
  "StellarSora/assets/assetbundles/actor2d/npc/917201/917201_l/917201_L",
  "StellarSora/assets/assetbundles/actor2d/npc/917202/917202_l/917202_L",
  "StellarSora/assets/assetbundles/actor2d/npc/917301/917301_l/917301_L",
  "StellarSora/assets/assetbundles/actor2d/npc/917302/917302_l/917302_L",
  "StellarSora/assets/assetbundles/actor2d/npc/917401/917401_l/917401_L",
  "StellarSora/assets/assetbundles/actor2d/npc/917402/917402_l/917402_L",
  "StellarSora/assets/assetbundles/disc/4005/4005_l/4005_F",
  "StellarSora/assets/assetbundles/disc/4006/4006_l/4006_F",
  "StellarSora/assets/assetbundles/disc/4007/4007_l/4007_F",
  "StellarSora/assets/assetbundles/disc/4026/4026_l/4026_F",
  "StellarSora/assets/assetbundles/disc/4027/4027_l/4027_F",
  "StellarSora/assets/assetbundles/disc/4028/4028_l/4028_F",
  "StellarSora/assets/assetbundles/disc/4036/4036_l/4036_F",
  "StellarSora/assets/assetbundles/disc/4037/4037_l/4037_F",
  "StellarSora/assets/assetbundles/ui/changegender/changegender/avg3_100_a/avg3_100_a",
  "StellarSora/assets/assetbundles/ui/changegender/changegender/avg3_101_a/avg3_101_a",
  "StellarSora/assets/assetbundles/ui/createplayer/l2d/createplayer_bg/createplayer_bg_F/createplayer2_F",
  "StellarSora/assets/assetbundles/ui/createplayer/l2d/createplayer_bg/createplayer_bg_M/createplayer2_M",
  "StellarSora/assets/assetbundles/ui/createplayer/l2d/createplayer_f/moc/createplayer_f/createplayer_F",
  "StellarSora/assets/assetbundles/ui/createplayer/l2d/createplayer_m/moc/createplayer_m/createplayer_M",
  "StellarSora/assets/assetbundles/ui/quest/l2d_daily_female/dailyquest_f_l",
  "StellarSora/assets/assetbundles/ui/quest/l2d_daily_male/dailyquest_m_l",
  "StellarSora/assets/assetbundles/ui/quest/l2d_tour_female/tourguide_f_l",
  "StellarSora/assets/assetbundles/ui/quest/l2d_tour_male/tourguide_m_l"
];

export type ModelSourceType = 'model3' | 'moc3';

export interface ModelDefinition {
  id: string;
  displayName: string;
  sourceType: ModelSourceType;
}

function normalizePath(path: string): string {
  return path.replace(/\\/g, '/');
}

function createDisplayNameFromPath(path: string): string {
  const normalized = normalizePath(path);
  const segments = normalized.split('/');
  if (segments.length >= 2) {
    const folder = segments[segments.length - 2];
    const file = segments[segments.length - 1];
    return `${folder}/${file}`;
  }
  return normalized;
}

export function getAvailableModels(gameIndex = 0): ModelDefinition[] {
  switch (gameIndex) {
    case 1:
      return ModelDir_StellarSora.map((entry) => ({
        id: normalizePath(entry),
        displayName: createDisplayNameFromPath(entry),
        sourceType: 'moc3' as ModelSourceType,
      }));
    case 0:
    default:
      return ModelDir_GFL2.map((entry) => ({
        id: entry,
        displayName: entry,
        sourceType: 'model3' as ModelSourceType,
      }));
  }
}

export function getModelDefinition(gameIndex: number, modelIndex: number): ModelDefinition | null {
  const models = getAvailableModels(gameIndex);
  if (models.length === 0) {
    return null;
  }
  const safeIndex = ((modelIndex % models.length) + models.length) % models.length;
  return models[safeIndex] ?? null;
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
