#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app


ENV ASPNETCORE_ENVIRONMENT	Development
ENV ASPNETCORE_LOGGING__CONSOLE__DISABLECOLORS	true
ENV ASPNETCORE_URLS	http://+:8000
ENV DOTNET_RUNNING_IN_CONTAINER	true
ENV DOTNET_USE_POLLING_FILE_WATCHER	1

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["dockerSample/dockerSample.csproj", "dockerSample/"]
RUN dotnet restore "dockerSample/dockerSample.csproj"
COPY . .
WORKDIR "/src/dockerSample"
RUN dotnet build "dockerSample.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "dockerSample.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 8000/tcp
ENTRYPOINT ["dotnet", "dockerSample.dll"]