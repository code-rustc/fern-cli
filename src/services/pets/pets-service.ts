import * as core from '../../core';
import type * as CodeRustcApi from '../../api';
import { BaseService } from '../base-service';
import { BaseClientOptions, BaseRequestOptions, ContentType, HttpResponse } from '../../http/types';
import { RequestBuilder } from '../../http/transport/request-builder';
import { SerializationStyle } from '../../http/serialization/base-serializer';
import { CodeRustcApiError } from '../../http/errors/throwable-error';
import { resolveAuthHeaders } from '../../http/auth';
import { HttpResponsePromise, WithRawResponse } from '../../http/response-promise';
import { Supplier, resolveHeaders } from '../../http/utils/supplier';
import { CodeRustcApiEnvironment } from '../../http/environment';
import { Pet, petResponse } from '../common/pet';
import { GetPetRequest, ListPetsRequest } from './request-params';
import { NewPet, newPetRequest } from '../common/new-pet';

export declare namespace PetsClient {
  export type Options = Partial<BaseClientOptions>;
  export interface RequestOptions extends BaseRequestOptions {}
}

/**
 * Client for Pets operations.
 * Provides methods to interact with Pets-related API endpoints.
 * All methods return promises and handle request/response serialization automatically.
 */
export class PetsClient extends BaseService {
  protected listPetsConfig?: Partial<BaseClientOptions>;

  protected createPetConfig?: Partial<BaseClientOptions>;

  protected getPetConfig?: Partial<BaseClientOptions>;

  /**
   * Sets method-level configuration for listPets.
   * @param config - Partial configuration to override service-level defaults
   * @returns This service instance for method chaining
   */
  setListPetsConfig(config: Partial<BaseClientOptions>): this {
    this.listPetsConfig = config;
    return this;
  }

  /**
   * Sets method-level configuration for createPet.
   * @param config - Partial configuration to override service-level defaults
   * @returns This service instance for method chaining
   */
  setCreatePetConfig(config: Partial<BaseClientOptions>): this {
    this.createPetConfig = config;
    return this;
  }

  /**
   * Sets method-level configuration for getPet.
   * @param config - Partial configuration to override service-level defaults
   * @returns This service instance for method chaining
   */
  setGetPetConfig(config: Partial<BaseClientOptions>): this {
    this.getPetConfig = config;
    return this;
  }

  /**
   *
   * @param {CodeRustcApi.ListPetsRequest} request
   * @param {PetsClient.RequestOptions} [requestOptions] - Request-specific configuration.
   * @returns {HttpResponsePromise<CodeRustcApi.Pet[]>} - A list of pets
   */
  listPets(
    request: CodeRustcApi.ListPetsRequest = {},
    requestOptions?: PetsClient.RequestOptions,
  ): HttpResponsePromise<CodeRustcApi.Pet[]> {
    return HttpResponsePromise.fromPromise(this.__listPets(request, requestOptions));
  }
  private async __listPets(
    request: CodeRustcApi.ListPetsRequest = {},
    requestOptions?: PetsClient.RequestOptions,
  ): Promise<WithRawResponse<CodeRustcApi.Pet[]>> {
    const resolvedConfig = this.getResolvedConfig(this.listPetsConfig, requestOptions);
    const resolvedBaseUrl = await Supplier.get(
      resolvedConfig.baseUrl ??
        resolvedConfig.environment ??
        resolvedConfig.codeRustcApiEnvironment,
    );
    const resolvedHeaders = await resolveHeaders(resolvedConfig.headers);
    const _request = new RequestBuilder()
      .setConfig({ ...resolvedConfig, headers: resolvedHeaders })
      .setBaseUrl(resolvedBaseUrl)
      .setMethod('GET')
      .setPath('/pets')
      .setRequestSchema(core.cast.identity<unknown>())
      .addAuthHeaders(
        await resolveAuthHeaders(
          resolvedConfig?.auth,
          await Supplier.get(resolvedConfig?.token),
          'Bearer',
        ),
      )
      .setRequestContentType(ContentType.Json)
      .addResponse({
        schema: core.cast.list(petResponse),
        contentType: ContentType.Json,
        status: 200,
      })
      .addQueryParam({
        key: 'limit',
        value: request.limit,
      })
      .build();
    return this.client.callWithRawResponse<CodeRustcApi.Pet[]>(_request);
  }

  /**
   *
   * @param {CodeRustcApi.NewPet} request
   * @param {PetsClient.RequestOptions} [requestOptions] - Request-specific configuration.
   * @returns {HttpResponsePromise<CodeRustcApi.Pet>} - Created
   */
  createPet(
    request: CodeRustcApi.NewPet,
    requestOptions?: PetsClient.RequestOptions,
  ): HttpResponsePromise<CodeRustcApi.Pet> {
    return HttpResponsePromise.fromPromise(this.__createPet(request, requestOptions));
  }
  private async __createPet(
    request: CodeRustcApi.NewPet,
    requestOptions?: PetsClient.RequestOptions,
  ): Promise<WithRawResponse<CodeRustcApi.Pet>> {
    const resolvedConfig = this.getResolvedConfig(this.createPetConfig, requestOptions);
    const resolvedBaseUrl = await Supplier.get(
      resolvedConfig.baseUrl ??
        resolvedConfig.environment ??
        resolvedConfig.codeRustcApiEnvironment,
    );
    const resolvedHeaders = await resolveHeaders(resolvedConfig.headers);
    const _request = new RequestBuilder()
      .setConfig({ ...resolvedConfig, headers: resolvedHeaders })
      .setBaseUrl(resolvedBaseUrl)
      .setMethod('POST')
      .setPath('/pets')
      .setRequestSchema(newPetRequest)
      .addAuthHeaders(
        await resolveAuthHeaders(
          resolvedConfig?.auth,
          await Supplier.get(resolvedConfig?.token),
          'Bearer',
        ),
      )
      .setRequestContentType(ContentType.Json)
      .addResponse({
        schema: petResponse,
        contentType: ContentType.Json,
        status: 201,
      })
      .addHeaderParam({ key: 'Content-Type', value: 'application/json' })
      .addBody(request)
      .build();
    return this.client.callWithRawResponse<CodeRustcApi.Pet>(_request);
  }

  /**
   *
   * @param {CodeRustcApi.GetPetRequest} request
   * @param {PetsClient.RequestOptions} [requestOptions] - Request-specific configuration.
   * @returns {HttpResponsePromise<CodeRustcApi.Pet>} - The pet
   */
  getPet(
    request: CodeRustcApi.GetPetRequest,
    requestOptions?: PetsClient.RequestOptions,
  ): HttpResponsePromise<CodeRustcApi.Pet> {
    return HttpResponsePromise.fromPromise(this.__getPet(request, requestOptions));
  }
  private async __getPet(
    request: CodeRustcApi.GetPetRequest,
    requestOptions?: PetsClient.RequestOptions,
  ): Promise<WithRawResponse<CodeRustcApi.Pet>> {
    const resolvedConfig = this.getResolvedConfig(this.getPetConfig, requestOptions);
    const resolvedBaseUrl = await Supplier.get(
      resolvedConfig.baseUrl ??
        resolvedConfig.environment ??
        resolvedConfig.codeRustcApiEnvironment,
    );
    const resolvedHeaders = await resolveHeaders(resolvedConfig.headers);
    const _request = new RequestBuilder()
      .setConfig({ ...resolvedConfig, headers: resolvedHeaders })
      .setBaseUrl(resolvedBaseUrl)
      .setMethod('GET')
      .setPath('/pets/{petId}')
      .setRequestSchema(core.cast.identity<unknown>())
      .addAuthHeaders(
        await resolveAuthHeaders(
          resolvedConfig?.auth,
          await Supplier.get(resolvedConfig?.token),
          'Bearer',
        ),
      )
      .setRequestContentType(ContentType.Json)
      .addResponse({
        schema: petResponse,
        contentType: ContentType.Json,
        status: 200,
      })
      .addPathParam({
        key: 'petId',
        value: request.petId,
      })
      .build();
    return this.client.callWithRawResponse<CodeRustcApi.Pet>(_request);
  }
}
