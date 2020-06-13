package main

import (
	"bytes"
	"compress/gzip"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"runtime"
	"sort"
	"strconv"
	"time"
)

// API

func contextListRest(JWTConig jwtConfig, itemChan ItemsChannel, operations GroupedOperations) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		query := parseURLParameters(r)

		items, queryTime := runQuery(ITEMS, query, operations)
		msg := fmt.Sprint("total: ", len(ITEMS), " hits: ", len(items), " time: ", queryTime, "ms ", "url: ", r.URL)
		fmt.Printf(NoticeColorN, msg)
		headerData := getHeaderData(items, query, queryTime)

		if !query.EarlyExit() {
			items = sortLimit(items, query)
		}

		w.Header().Set("Content-Type", "application/json")
		for key, val := range headerData {
			w.Header().Set(key, val)
		}

		w.WriteHeader(http.StatusOK)

		groupByS, groupByFound := r.URL.Query()["groupby"]
		if !groupByFound {
			json.NewEncoder(w).Encode(items)
			return
		}

		groupByItems := groupByRunner(items, groupByS[0])
		json.NewEncoder(w).Encode(groupByItems)
		go func() {
			time.Sleep(2 * time.Second)
			runtime.GC()
		}()
	}
}

func ItemChanWorker(itemChan ItemsChannel) {
	for items := range itemChan {
		for _, item := range items {
			ITEMS = append(ITEMS, item)
		}
	}
}

func contextAddRest(JWTConig jwtConfig, itemChan ItemsChannel, operations GroupedOperations) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		jsonDecoder := json.NewDecoder(r.Body)
		var items Items
		err := jsonDecoder.Decode(&items)
		if err != nil {
			fmt.Println(err)
		}
		msg := fmt.Sprint("adding ", len(items))
		fmt.Printf(WarningColorN, msg)
		itemChan <- items
		w.WriteHeader(204)
	}
}

func rmRest(w http.ResponseWriter, r *http.Request) {
	ITEMS = make(Items, 0, 100*1000)
	go func() {
		time.Sleep(1 * time.Second)
		runtime.GC()
	}()
	w.WriteHeader(204)
}

func loadRest(w http.ResponseWriter, r *http.Request) {
	filename := "ITEMS.txt.gz"
	fi, err := os.Open(filename)
	if err != nil {
		return
	}
	defer fi.Close()

	fz, err := gzip.NewReader(fi)
	if err != nil {
		return
	}
	defer fz.Close()

	s, err := ioutil.ReadAll(fz)
	if err != nil {
		return
	}

	// TODO find out why wihout GC memory keeps growing
	runtime.GC()
	ITEMS = make(Items, 0, 100*100)
	runtime.GC()
	json.Unmarshal(s, &ITEMS)
	msg := fmt.Sprint("Loaded new items in memory amount: ", len(ITEMS))
	fmt.Printf(WarningColorN, msg)
	go func() {
		time.Sleep(1 * time.Second)
		runtime.GC()
	}()
	return
}

func saveRest(w http.ResponseWriter, r *http.Request) {
	filename := "ITEMS.txt.gz"
	var b bytes.Buffer
	writer := gzip.NewWriter(&b)
	itemJSON, _ := json.Marshal(ITEMS)
	writer.Write(itemJSON)
	writer.Flush()
	writer.Close()
	err := ioutil.WriteFile(filename, b.Bytes(), 0666)
	if err != nil {
		// TODO better error handling
		fmt.Println(err)
		w.WriteHeader(500)
		return
	}
	w.WriteHeader(204)
}

func validColumn(column string, columns []string) bool {
	for _, item := range columns {
		if column == item {
			return true
		}
	}
	return false
}

// Other wise also known in mathematics as set but in http name it would be confused with the verb set.
//func UniqueValuesInColumn(w http.ResponseWriter, r *http.Request) {
//	column := r.URL.Path[1:]
//	response := make(map[string]string)
//	if len(ITEMS) == 0 {
//		response["message"] = fmt.Sprint("invalid input: ", column)
//		w.WriteHeader(400)
//		json.NewEncoder(w).Encode(response)
//		return
//
//	}
//	validColumns := ITEMS[0].Columns()
//
//	if !validColumn(column, validColumns) {
//		w.WriteHeader(400)
//
//		response["message"] = fmt.Sprint("invalid input: ", column)
//		response["input"] = column
//		response["valid input"] = strings.Join(validColumns, ", ")
//		json.NewEncoder(w).Encode(response)
//		return
//	}
//	set := make(map[string]bool)
//	for item := range ITEMS {
//		r := reflect.ValueOf(item)
//		value := reflect.Indirect(r).FieldByName(column)
//		valu
//		set[value.Str()] = true
//	}
//
//}
type ShowItem struct {
	IsShow bool   `json:"isShow"`
	Label  string `json:"label"`
	Name   string `json:"name"`
}

type Meta struct {
	Fields []ShowItem `json:"fields"`
	View   string     `json:"view"`
}

type searchResponse struct {
	Count int   `json:"count"`
	Data  Items `json:"data"`
	MMeta *Meta `json:"meta"`
}

func makeResp(items Items) searchResponse {
	fields := []ShowItem{}
	for _, column := range items[0].Columns() {
		fields = append(fields, ShowItem{IsShow: true, Name: column, Label: column})
	}

	return searchResponse{
		Count: len(items),
		Data:  items,
		MMeta: &Meta{Fields: fields, View: "table"},
	}
}

func contextSearchRest(JWTConig jwtConfig, itemChan ItemsChannel, operations GroupedOperations) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		query := parseURLParameters(r)

		items, queryTime := runQuery(ITEMS, query, operations)
		if len(items) == 0 {
			w.WriteHeader(404)
			return
		}
		msg := fmt.Sprint("total: ", len(ITEMS), " hits: ", len(items), " time: ", queryTime, "ms ", "url: ", r.URL)
		fmt.Printf(NoticeColorN, msg)
		headerData := getHeaderData(items, query, queryTime)

		if !query.EarlyExit() {
			items = sortLimit(items, query)
		}

		w.Header().Set("Content-Type", "application/json")
		for key, val := range headerData {
			w.Header().Set(key, val)
		}

		w.WriteHeader(http.StatusOK)

		response := makeResp(items)
		json.NewEncoder(w).Encode(response)
	}
}

func helpRest(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	response := make(map[string][]string)
	registeredFilters := []string{}
	for k := range RegisterFuncMap {
		registeredFilters = append(registeredFilters, k)
	}

	registeredGroupbys := []string{}
	for k := range RegisterGroupBy {
		registeredGroupbys = append(registeredGroupbys, k)
	}

	_, registeredSortings := sortBy(ITEMS, []string{})

	sort.Strings(registeredFilters)
	sort.Strings(registeredGroupbys)
	sort.Strings(registeredSortings)
	response["filters"] = registeredFilters
	response["groupby"] = registeredGroupbys
	response["sortby"] = registeredSortings
	totalItems := strconv.Itoa(len(ITEMS))

	host := SETTINGS.Get("http_db_host")
	response["total-items"] = []string{totalItems}
	response["settings"] = []string{
		fmt.Sprintf("host: %s", host),
		fmt.Sprintf("JWT: %s", SETTINGS.Get("JWTENABLED")),
	}
	response["examples"] = []string{
		fmt.Sprintf("typeahead: http://%s/list/?typeahead=ams&limit=10", host),
		fmt.Sprintf("search: http://%s/list/?search=ams&page=1&pagesize=1", host),
		fmt.Sprintf("search with limit: http://%s/list/?search=10&page=1&pagesize=10&limit=5", host),
		fmt.Sprintf("sorting: http://%s/list/?search=100&page=10&pagesize=100&sortby=-country", host),
		fmt.Sprintf("filtering: http://%s/list/?search=10&ontains-case=144&contains-case=10&page=1&pagesize=1", host),
	}
	w.WriteHeader(http.StatusOK)

	json.NewEncoder(w).Encode(response)
}
