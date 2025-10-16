import { baseApi } from "@/redux/baseApi";

export const tourApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addTourType: builder.mutation({
            query: (tourType) => ({
                url: "/tour/create-tour-type",
                method: "POST",
                data: tourType
            }),
            invalidatesTags: ["TOUR"]
        }),
        getTourType: builder.query({
            query: () => ({
                url: "/tour/tour-types",
                method: "GET",
            }),
            providesTags: ["TOUR"]
        })
    })
})

export const { useAddTourTypeMutation, useGetTourTypeQuery } = tourApi;