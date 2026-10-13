// Composition belongs at the entrance, never inside Athanor.
import './athanor.js';
import {hermeticon} from '../arcana/hermeticon.js';
globalThis.Athanor.mount('hermeticon',hermeticon);
