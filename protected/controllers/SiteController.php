<?php

namespace app\controllers;

use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\filters\VerbFilter;
use yii\helpers\FileHelper;
use wapmorgan\Mp3Info\Mp3Info;

class SiteController extends Controller
{
    /**
     * {@inheritdoc}
     */
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::class,
                'only' => ['logout'],
                'rules' => [
                    [
                        'actions' => ['logout'],
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                ],
            ],
            'verbs' => [
                'class' => VerbFilter::class,
                'actions' => [
                    'logout' => ['post'],
                ],
            ],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
            'captcha' => [
                'class' => 'yii\captcha\CaptchaAction',
                'fixedVerifyCode' => YII_ENV_TEST ? 'testme' : null,
            ],
        ];
    }

    /**
     * Displays homepage.
     *
     * @return string
     */
    public function actionIndex()
    {
        return $this->render('index');
    }

	public function actionRescan_media()
	{
		$mediaRootPath = Yii::getAlias('@media_root');
		$mediaRootUrl = Yii::getAlias('@media_url');
		$fileList = FileHelper::findFiles($mediaRootPath, ['only'=>['*.mp3','*.ogg','*.webm']], ['recursive'=>true]);
		$fileData = [];
		foreach($fileList as $id=>$file) {
			switch(substr($file, strrpos($file,'.') + 1)){
				case 'mp3':
					$audio = new Mp3Info($file, true);
					$fileData[] = [
						'id'=>$id,
						'url'=>$mediaRootUrl . '/' . substr($file, strlen($mediaRootPath) + 1),
						'duration'=>$audio->duration,
						'track'=>$audio->tags['track'] ?? 'Unknown Track',
						'title'=>trim($audio->tags['song'] ?? 'Unknown Title','?'),
						'artist'=>$audio->tags['artist'] ?? 'Unknown Artist',
						'album'=>$audio->tags['album'] ?? 'Unknown Album',
						'year'=>$audio->tags['year'] ?? 'Unknown Year',
						'genre'=>$audio->tags['genre'] ?? 'Unknown Genre',
					];
					break;
			}
		}
		return $this->asJson(['list'=>$fileData]);
	}

}
