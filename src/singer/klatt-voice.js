// Runs the Klatt core inside an AudioWorklet. The module is passed as a data: URL, which (unlike blob: URLs)
// also loads when the game is opened straight from disk.
(function (LM) {
  'use strict';

  const PROCESSOR_NAME = 'klatt-singer';
  const modulePromises = new WeakMap();
  const readyContexts = new WeakSet();

  // Runs inside the AudioWorkletGlobalScope (sampleRate, currentTime and registerProcessor are its globals).
  function registerKlattSingerProcessor(createKlattSynth) {
    class KlattSingerProcessor extends AudioWorkletProcessor {
      constructor(options) {
        super();
        this.synth = createKlattSynth(sampleRate, options.processorOptions.events);
        this.endTime = options.processorOptions.endTime;
        this.isStopped = false;
        this.port.onmessage = () => { this.isStopped = true; };
      }

      process(inputs, outputs) {
        this.synth.render(outputs[0][0], currentTime);
        return !this.isStopped && currentTime < this.endTime;
      }
    }
    registerProcessor('klatt-singer', KlattSingerProcessor);
  }

  function workletSource() {
    return '(' + registerKlattSingerProcessor.toString() + ')(' + LM.klattCore.createKlattSynth.toString() + ');';
  }

  // Resolves to true when the singer can run in this context's audio thread.
  function prepare(context) {
    if (!context.audioWorklet) {
      return Promise.resolve(false);
    }
    if (!modulePromises.has(context)) {
      const url = 'data:application/javascript,' + encodeURIComponent(workletSource());
      const loading = context.audioWorklet.addModule(url).then(function () {
        readyContexts.add(context);
        return true;
      }, function () { return false; });
      modulePromises.set(context, loading);
    }
    return modulePromises.get(context);
  }

  function isReady(context) {
    return readyContexts.has(context);
  }

  function startKlattVoice(context, destination, plan) {
    const node = new AudioWorkletNode(context, PROCESSOR_NAME, {
      numberOfInputs: 0,
      outputChannelCount: [1],
      processorOptions: { events: plan.events, endTime: plan.endTime + 0.6 },
    });
    node.connect(destination);
    return {
      stop: function () {
        node.port.postMessage('stop');
        node.disconnect();
      },
    };
  }

  LM.klattVoice = { prepare, isReady, startKlattVoice };
}(window.LM = window.LM || {}));
