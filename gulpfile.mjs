import gulp from "gulp";
import {deleteAsync, deleteSync} from "del";
import fs from "fs-extra";
import path from "path";
import {exec, execSync} from 'child_process';

function cleanPacks(){
    console.log('deleting compendium packs...');
    deleteSync(['./packs/trophy-srd-items/*']);
    deleteSync(['./packs/trophy-srd-roll-tables/*']);
    deleteSync(['./packs/trophy-srd-skills/*']);
    deleteSync(['./packs/trophy-srd-spells/*']);
    deleteSync(['./packs/trophy-srd-weapons-and-attacks/*']);
    console.log('existing packs deleted.');
}

function buildPacks(){
  exec('fvtt package pack "trophy-srd-items" --inputDirectory "./source/packs/trophy-srd-items" --outputDirectory "./packs"', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    //cb(err);
    if(err != null){
      console.log(err);
    }    
  });

  exec('fvtt package pack "trophy-srd-roll-tables" --inputDirectory "./source/packs/trophy-srd-roll-tables" --outputDirectory "./packs"', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    //cb(err);
    if(err != null){
      console.log(err);
    } 
  });

  exec('fvtt package pack "trophy-srd-skills" --inputDirectory "./source/packs/trophy-srd-skills" --outputDirectory "./packs"', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    //cb(err);
    if(err != null){
      console.log(err);
    } 
  });

  exec('fvtt package pack "trophy-srd-spells" --inputDirectory "./source/packs/trophy-srd-spells" --outputDirectory "./packs"', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    //cb(err);
    if(err != null){
      console.log(err);
    } 
  });

  exec('fvtt package pack "trophy-srd-weapons-and-attacks" --inputDirectory "./source/packs/trophy-srd-weapons-and-attacks" --outputDirectory "./packs"', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    //cb(err);
    if(err != null){
      console.log(err);
    } 
  });

  exec('fvtt package pack "trophy-srd-backgrounds" --inputDirectory "./source/packs/trophy-srd-backgrounds" --outputDirectory "./packs"', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    //cb(err);
    if(err != null){
      console.log(err);
    } 
  });
}

const build = () =>
  new Promise(done => {
    console.log('Beginning build process...');
    cleanPacks();
    console.log('Building compendium packs...');
    buildPacks();
    console.log('Build process complete.');
    done();    
});

gulp.task('build-packs', function (cb) {
  buildPacks();
});

function getTrophySystemPath(){
  let foundrydataPath = "";
  foundrydataPath = execSync('fvtt configure get dataPath').toString().trim();
  foundrydataPath += '/Data/systems/trophy';  
  return foundrydataPath;
}

// THIS WILL DELETE THE EXISTING TROIKA SYSTEM!
// MAKE SURE THIS CODE ISN'T RUNNING *FROM* THE FOUNDRY DATA PATH!
function cleanExistingTrophySystemFiles(){
  let trophyPath = getTrophySystemPath();

  if(trophyPath !== null && trophyPath !== '' && trophyPath.indexOf("/Data/systems/trophy") > 1){
    console.log('Deleting all files in: ' + trophyPath);
    deleteSync([trophyPath + '/*'], {force: true});
  }
  else{
    console.log('ERROR - BAD TROIKA PATH, WILL NOT CLEAN FOLDER! CHECK THAT FOUNDRY CLI CONFIGURED PROPERLY!');
  }

}

gulp.task('clean-existing-system-files', function (done) {
  cleanExistingTrophySystemFiles()
  done();
});

gulp.task('test', function (done) {

  let trophyPath = getTrophySystemPath();

  gulp.src(['./**/*']).pipe(gulp.dest(trophyPath));

  done();
});

export default build;