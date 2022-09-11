import { globalStore, useGlobalStore } from "drip/runtime.ts";
import { computed, signal } from "preact/signals";

export const success = signal<null | { Component: any; props: any }>(null);

const state = computed(() => {
  return {
    ...globalStore.value,
    _success: success.value,
  };
});

export default function () {
  const { _errors: errors, _success: success } = state.value;

  if (errors?.length) {
    return (
      <div class="sm:mx-auto sm:w-full sm:max-w-md pt-4">
        <div class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                There were {errors.length} errors with your submission
              </h3>
              <div class="mt-2 text-sm text-red-700">
                <ul role="list" class="list-disc pl-5 space-y-1">
                  {errors.map((error) => {
                    return <li>{error.message}</li>;
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div class="sm:mx-auto sm:w-full sm:max-w-md pt-4">
        <div class="rounded-md bg-green-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-green-800">
                <success.Component {...success.props} />
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // we can't return null in island due to issue in fresh
  return <div />;
}
