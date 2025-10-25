/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { CubismMatrix44 } from '@framework/math/cubismmatrix44';
import { CubismVector2 } from '@framework/math/cubismvector2';
import { ACubismMotion } from '@framework/motion/acubismmotion';
import { csmVector } from '@framework/type/csmvector';

import * as LAppDefine from './lappdefine';
import { LAppModel } from './lappmodel';
import { LAppPal } from './lapppal';
import { LAppSubdelegate } from './lappsubdelegate';

/**
 * サンプルアプリケーションにおいてCubismModelを管理するクラス
 * モデル生成と破棄、タップイベントの処理、モデル切り替えを行う。
 */
export class LAppLive2DManager {
  /**
   * 現在のシーンで保持しているすべてのモデルを解放する
   */
  private releaseAllModel(): void {
    this._models.clear();
  }

  /**
   * 画面をドラッグした時の処理
   *
   * @param x 画面のX座標
   * @param y 画面のY座標
   */
  public onTouch(x: number, y: number): void {
    const model: LAppModel = this._models.at(0);
    if (model) {
      this._shouldDrag = true;
      this._lastDrag.x = x;
      this._lastDrag.y = y;
    }
  }

  /**
   * 画面をドラッグした時の処理
   *
   * @param x 画面のX座標
   * @param y 画面のY座標
   */
  public onDrag(x: number, y: number): void {
    const model: LAppModel = this._models.at(0);
    if (this._shouldDrag && model && x != 0 && y != 0) {
      this._translate.x += x - this._lastDrag.x;
      this._translate.y += y - this._lastDrag.y;
      this._lastDrag.x = x;
      this._lastDrag.y = y;
      //model.setDragging(x, y);
    }
  }

  /**
   * 画面をタップした時の処理
   *
   * @param x 画面のX座標
   * @param y 画面のY座標
   */
  public onTap(x: number, y: number): void {
    if (LAppDefine.DebugLogEnable) {
      LAppPal.printMessage(
        `[APP]tap point: {x: ${x.toFixed(2)} y: ${y.toFixed(2)}}`
      );
    }
    this._shouldDrag = false;
    const model: LAppModel = this._models.at(0);
/*
    if (model.hitTest(LAppDefine.HitAreaNameHead, x, y)) {
      if (LAppDefine.DebugLogEnable) {
        LAppPal.printMessage(`[APP]hit area: [${LAppDefine.HitAreaNameHead}]`);
      }
      model.setRandomExpression();
    } else if (model.hitTest(LAppDefine.HitAreaNameBody, x, y)) {
      if (LAppDefine.DebugLogEnable) {
        LAppPal.printMessage(`[APP]hit area: [${LAppDefine.HitAreaNameBody}]`);
      }
      model.startRandomMotion(
        LAppDefine.MotionGroupTapBody,
        LAppDefine.PriorityNormal,
        this.finishedMotion,
        this.beganMotion
      );
    }*/
  }

  /**
   * 画面を更新するときの処理
   * モデルの更新処理及び描画処理を行う
   */
  public onUpdate(): void {
    const { width, height } = this._subdelegate.getCanvas();

    const projection: CubismMatrix44 = new CubismMatrix44();
    const model: LAppModel = this._models.at(0);

    if (model.getModel()) {
      if (model.getModel().getCanvasWidth() > 1.0 && width < height) {
        // 横に長いモデルを縦長ウィンドウに表示する際モデルの横サイズでscaleを算出する
        model.getModelMatrix().setWidth(2.0);
        projection.scale(1.0, width / height);
        projection.translate(this._translate.x, this._translate.y * width / height);
      } else {
        projection.scale(height / width, 1.0);
        projection.translate(this._translate.x * height / width, this._translate.y);
      }
      projection.scaleRelative(this._zoom, this._zoom);

      // 必要があればここで乗算
      if (this._viewMatrix != null) {
        projection.multiplyByMatrix(this._viewMatrix);
      }
    }

    model.update();
    model.draw(projection); // 参照渡しなのでprojectionは変質する。
  }

  /**
   * 次のシーンに切りかえる
   * サンプルアプリケーションではモデルセットの切り替えを行う。
   */
  public nextScene(): void {
    const available = LAppDefine.getAvailableModels(this._gameIndex);
    if (available.length === 0) {
      this.releaseAllModel();
      this._sceneIndex = 0;
      return;
    }
    const no: number = (this._sceneIndex + 1) % available.length;
    this.changeScene(no);
  }

  /**
   * シーンを切り替える
   * サンプルアプリケーションではモデルセットの切り替えを行う。
   * @param index
   */
  private changeScene(index: number): void {
    this._sceneIndex = index;

    if (!this._subdelegate) {
      return;
    }

    if (LAppDefine.DebugLogEnable) {
      LAppPal.printMessage(`[APP]model index: ${this._sceneIndex}`);
    }

    const models = LAppDefine.getAvailableModels(this._gameIndex);
    if (models.length === 0) {
      this.releaseAllModel();
      return;
    }
    const entry = models[index % models.length];
    const source = this.resolveModelSource(entry.id, entry.sourceType);
    if (!source) {
      if (LAppDefine.DebugLogEnable) {
        LAppPal.printMessage(`[APP]Failed to resolve model source for ${entry.id}`);
      }
      return;
    }

    this.releaseAllModel();
    const instance = new LAppModel();
    instance.setSubdelegate(this._subdelegate);
    instance.loadAssets(source.dir, source.file);
    this._models.pushBack(instance);
  }

  public setViewMatrix(m: CubismMatrix44) {
    for (let i = 0; i < 16; i++) {
      this._viewMatrix.getArray()[i] = m.getArray()[i];
    }
  }

  /**
   * モデルの追加
   */
  public addModel(sceneIndex: number = 0): void {
    const available = LAppDefine.getAvailableModels(this._gameIndex);
    if (available.length === 0) {
      this.releaseAllModel();
      this._sceneIndex = 0;
      return;
    }
    this._sceneIndex = ((sceneIndex % available.length) + available.length) % available.length;
    this.changeScene(this._sceneIndex);
  }

  public getModel(index: number = 0) : LAppModel {
    return this._models.at(index);
  }

  public getGameIndex(): number {
    return this._gameIndex;
  }

  public adjustZoom(zoom: number): void {
    const maxZoom: number = LAppDefine.ViewMaxScale;
    const minZoom: number = LAppDefine.ViewMinScale;

    const targetZoom = zoom * this._zoom;

    if (targetZoom < minZoom) {
      this._translate.x *= this._zoom / minZoom;
      this._translate.y *= this._zoom / minZoom;
      this._zoom = minZoom;
    } 
    else if (targetZoom > maxZoom) {
      this._translate.x *= maxZoom / this._zoom;
      this._translate.y *= maxZoom / this._zoom;
      this._zoom = maxZoom;
    }
    else{
      this._zoom = targetZoom;
      this._translate.x *= zoom;
      this._translate.y *= zoom;
    }
  }

  /**
   * コンストラクタ
   */
  public constructor() {
    this._subdelegate = null;
    this._viewMatrix = new CubismMatrix44();
    this._translate = new CubismVector2();
    this._lastDrag = new CubismVector2();
    this._models = new csmVector<LAppModel>();
    this._sceneIndex = 0;
    this._gameIndex = 0;
  }

  /**
   * 解放する。
   */
  public release(): void {}

  /**
   * 初期化する。
   * @param subdelegate
   */
  public initialize(subdelegate: LAppSubdelegate): void {
    this._subdelegate = subdelegate;
    this.changeScene(this._sceneIndex);
  }

  public setGameIndex(gameIndex: number): void {
    if (this._gameIndex === gameIndex) {
      return;
    }
    this._gameIndex = gameIndex;
    const available = LAppDefine.getAvailableModels(this._gameIndex);
    if (available.length === 0) {
      this.releaseAllModel();
      this._sceneIndex = 0;
      return;
    }
    this._sceneIndex = 0;
    if (!this._subdelegate) {
      return;
    }
    this.changeScene(this._sceneIndex);
  }

  /**
   * 自身が所属するSubdelegate
   */
  private _subdelegate: LAppSubdelegate;

  _viewMatrix: CubismMatrix44; // モデル描画に用いるview行列
  _models: csmVector<LAppModel>; // モデルインスタンスのコンテナ
  private _sceneIndex: number; // 表示するシーンのインデックス値
  private _gameIndex: number;
  private _translate: CubismVector2;
  private _lastDrag: CubismVector2;
  private _shouldDrag: boolean = false;
  private _zoom: number = 1;

  private resolveModelSource(id: string, sourceType: LAppDefine.ModelSourceType): { dir: string; file: string } | null {
    if (!id) {
      return null;
    }

    const normalized = id.replace(/\\/g, '/');

    if (sourceType === 'model3') {
      const dir = `${LAppDefine.ResourcesPath}${normalized}/`;
      const file = `${normalized}.model3.json`;
      return { dir, file };
    }

    if (sourceType === 'moc3') {
      const lastSlash = normalized.lastIndexOf('/');
      if (lastSlash === -1) {
        return null;
      }
      const base = normalized.substring(0, lastSlash + 1);
      const filename = normalized.substring(lastSlash + 1);
      const dir = `../${LAppDefine.ResourcesPath}${base}`;
      const file = `${filename}.model3.json`;
      return { dir, file };
    }

    return null;
  }

  // モーション再生開始のコールバック関数
  beganMotion = (self: ACubismMotion): void => {
    LAppPal.printMessage('Motion Began:');
    console.log(self);
  };
  // モーション再生終了のコールバック関数
  finishedMotion = (self: ACubismMotion): void => {
    LAppPal.printMessage('Motion Finished:');
    console.log(self);
  };
}
