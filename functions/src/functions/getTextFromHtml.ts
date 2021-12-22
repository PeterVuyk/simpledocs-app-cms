import * as functions from 'firebase-functions';
import {htmlToText} from 'html-to-text';

export const getTextFromHtml = functions
    .region(functions.config().api.firebase_region)
    .https.onCall(async (data, context) => {
      // For now we distinguish app users (anonymous without email address) and cms users (with email address).
      // Later we could add something like a admin boolean inside a custom claim
      if (context.auth?.token.email === undefined) {
        return {success: false, message: 'unauthorized to call this function', result: null};
      }
      const text = htmlToText(data.html, {
        preserveNewlines: true,
        wordwrap: false,
        selectors: [
          {selector: 'h1', options: {uppercase: false}},
          {selector: 'h2', options: {uppercase: false}},
          {selector: 'h3', options: {uppercase: false}},
          {selector: 'h4', options: {uppercase: false}},
          {selector: 'h5', options: {uppercase: false}},
          {selector: 'h6', options: {uppercase: false}},
          {selector: 'table', options: {uppercaseHeaderCells: false}},
          {selector: 'img', format: 'skip'},
          {selector: 'a', options: {ignoreHref: true}},
        ],
      });
      return {success: true, message: null, result: text.trim().replace(/\n\s*\n/g, '\n\n')};
    });
