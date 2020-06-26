import React, { useEffect, useRef } from 'react'
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
const STLLoader = require('three-stl-loader')(THREE)
const color = new THREE.Color('rgb(245, 245, 245)')

const STLHTTP = () => {
  const wrapEle = useRef(null)
  const fileName = 'Menger_sponge_sample.stl'
  const loader = new STLLoader()
  let camera, controls, renderer, cube, scene, requestID


  // Standard scene setup in Three.js. Check "Creating a scene" manual for more information
  // https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
  const sceneSetup = () => {
    // get container dimensions and use them for scene sizing
    const width = wrapEle.current.clientWidth
    const height = wrapEle.current.clientHeight

    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(
      75, // fov = field of view
      width / height, // aspect ratio
      0.1, // near plane
      1000 // far plane
    )
    camera.position.z = 9; // is used here to set some distance from a cube that is located at z = 0
    // OrbitControls allow a camera to orbit around the object
    // https://threejs.org/docs/#examples/controls/OrbitControls
    controls = new OrbitControls( camera, wrapEle.current )
    renderer = new THREE.WebGLRenderer()
    renderer.setSize( width, height )
    wrapEle.current.appendChild( renderer.domElement ) // wrapEle.current using React ref
  }

  // Here should come custom code.
  // Code below is taken from Three.js BoxGeometry example
  // https://threejs.org/docs/#api/en/geometries/BoxGeometry
  const addCustomSceneObjects = () => {
    const geometry = new THREE.BoxGeometry(2, 2, 2)
    const material = new THREE.MeshPhongMaterial( {
        color: 0x156289,
        emissive: 0x072534,
        side: THREE.DoubleSide,
        flatShading: true
    } )
    // cube = new THREE.Mesh( geometry, material )
    // scene.add( cube )

    loader.load(`/${fileName}`, function (geometry) {
      console.log(wrapEle)
      const material = new THREE.MeshNormalMaterial()
      cube = new THREE.Mesh(geometry, material)
      scene.add(cube)
      startAnimationLoop()
    })

    const lights = []
    lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 )
    lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 )
    lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 )

    lights[ 0 ].position.set( 0, 200, 0 )
    lights[ 1 ].position.set( 100, 200, 100 )
    lights[ 2 ].position.set( - 100, - 200, - 100 )

    scene.add( lights[ 0 ] )
    scene.add( lights[ 1 ] )
    scene.add( lights[ 2 ] )
  }

  const startAnimationLoop = () => {
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

    // set màu nền
    renderer.setClearColor( 0xffffff, 1 )
    renderer.render( scene, camera )

    // The window.requestAnimationFrame() method tells the browser that you wish to perform
    // an animation and requests that the browser call a specified function
    // to update an animation before the next repaint
    requestID = window.requestAnimationFrame(startAnimationLoop);
  }

  const handleWindowResize = () => {
    const width = wrapEle.current.clientWidth
    const height = wrapEle.current.clientHeight

    renderer.setSize( width, height )
    camera.aspect = width / height

    // Note that after making changes to most of camera properties you have to call
    // .updateProjectionMatrix for the changes to take effect.
    camera.updateProjectionMatrix()
  }

  useEffect(() => {
    sceneSetup()
    addCustomSceneObjects()
    // startAnimationLoop()
    window.addEventListener('resize', handleWindowResize)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
      window.cancelAnimationFrame(requestID)
      controls.dispose()
    }
  }, [])

  return (
    <>
      <div
        ref={wrapEle}
        className="stl-wrap">

      </div>
    </>
  )
}

export default STLHTTP
